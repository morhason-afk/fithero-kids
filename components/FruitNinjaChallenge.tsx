'use client'

import { useState, useRef, useEffect } from 'react'
import { Challenge } from '@/types/challenge'
import { initializePoseDetector, detectPose, getHandPositions, checkCollision } from '@/utils/poseDetection'
import { playSound } from '@/utils/sounds'
import styles from './FruitNinjaChallenge.module.css'

interface FallingObject {
  id: number
  x: number
  y: number
  emoji: string
  speed: number
  size: number
  hit: boolean
}

interface FruitNinjaChallengeProps {
  challenge: Challenge
  onComplete: (score: number, hits: number) => void
  onCancel: () => void
}

const FRUITS = ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍉']
const OBJECT_SIZE = 60
const SPAWN_INTERVAL = 800 // milliseconds
const GRAVITY = 2

export default function FruitNinjaChallenge({ challenge, onComplete, onCancel }: FruitNinjaChallengeProps) {
  const [isActive, setIsActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(challenge.duration)
  const [objects, setObjects] = useState<FallingObject[]>([])
  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)
  const [cameraStatus, setCameraStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const detectorRef = useRef<any>(null)
  const objectIdCounterRef = useRef(0)
  const previousHandPositionsRef = useRef<{ leftWrist: { x: number; y: number } | null; rightWrist: { x: number; y: number } | null }>({
    leftWrist: null,
    rightWrist: null,
  })
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    initializeCamera()
    return () => {
      cleanup()
    }
  }, [])

  useEffect(() => {
    if (cameraStatus === 'ready' && videoRef.current) {
      initializePoseDetector().then(detector => {
        detectorRef.current = detector
      })
    }
  }, [cameraStatus])

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      spawnIntervalRef.current = setInterval(() => {
        spawnObject()
      }, SPAWN_INTERVAL)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
    }
  }, [isActive, timeRemaining])

  useEffect(() => {
    if (isActive && cameraStatus === 'ready') {
      startGameLoop()
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isActive, cameraStatus])

  const initializeCamera = async () => {
    try {
      setCameraStatus('loading')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
        videoRef.current.playsInline = true
        videoRef.current.play().catch((e) => console.error('Video play error:', e))
      }
      setCameraStatus('ready')
    } catch (err: any) {
      console.error('Error accessing camera:', err)
      setCameraStatus('error')
      setError('Could not access camera. Please check permissions.')
    }
  }

  const spawnObject = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const newObject: FallingObject = {
      id: objectIdCounterRef.current++,
      x: Math.random() * (canvas.width - OBJECT_SIZE),
      y: -OBJECT_SIZE,
      emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)],
      speed: 2 + Math.random() * 2,
      size: OBJECT_SIZE,
      hit: false,
    }

    setObjects(prev => [...prev, newObject])
  }

  const startGameLoop = async () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const video = videoRef.current

    if (!canvas || !ctx || !video || !detectorRef.current) return

    const gameLoop = async () => {
      if (!isActive) return

      // Update and draw objects
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Detect pose and get hand positions
      const pose = await detectPose(detectorRef.current, video)
      let handPositions = getHandPositions(pose)
      
      // Scale hand positions to canvas coordinates
      if (handPositions.leftWrist && video.videoWidth && video.videoHeight) {
        handPositions.leftWrist = {
          x: (handPositions.leftWrist.x / video.videoWidth) * canvas.width,
          y: (handPositions.leftWrist.y / video.videoHeight) * canvas.height,
        }
      }
      if (handPositions.rightWrist && video.videoWidth && video.videoHeight) {
        handPositions.rightWrist = {
          x: (handPositions.rightWrist.x / video.videoWidth) * canvas.width,
          y: (handPositions.rightWrist.y / video.videoHeight) * canvas.height,
        }
      }

      // Update objects and check collisions
      setObjects(prevObjects => {
        const updatedObjects = prevObjects
          .map(obj => {
            if (obj.hit) return null

            // Update position
            const newY = obj.y + obj.speed * GRAVITY

            // Check collision with hands
            let hit = false
            if (handPositions.leftWrist && checkCollision(handPositions.leftWrist, { ...obj, y: newY })) {
              hit = true
            }
            if (handPositions.rightWrist && checkCollision(handPositions.rightWrist, { ...obj, y: newY })) {
              hit = true
            }

            if (hit) {
              playSound('complete')
              setScore(prev => prev + 10)
              setHits(prev => prev + 1)
              return null
            }

            // Remove if off screen
            if (newY > canvas.height) {
              return null
            }

            return { ...obj, y: newY }
          })
          .filter((obj): obj is FallingObject => obj !== null)

        // Draw objects
        updatedObjects.forEach(obj => {
          ctx.font = `${obj.size}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(obj.emoji, obj.x + obj.size / 2, obj.y + obj.size / 2)
        })

        return updatedObjects
      })

      // Draw hand positions (for debugging)
      if (handPositions.leftWrist) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        ctx.beginPath()
        ctx.arc(handPositions.leftWrist.x, handPositions.leftWrist.y, 30, 0, Math.PI * 2)
        ctx.fill()
      }
      if (handPositions.rightWrist) {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
        ctx.beginPath()
        ctx.arc(handPositions.rightWrist.x, handPositions.rightWrist.y, 30, 0, Math.PI * 2)
        ctx.fill()
      }

      previousHandPositionsRef.current = handPositions
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()
  }

  const handleStart = () => {
    setIsActive(true)
    setTimeRemaining(challenge.duration)
    setScore(0)
    setHits(0)
    setObjects([])
  }

  const handleComplete = () => {
    setIsActive(false)
    onComplete(score, hits)
  }

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (timerRef.current) clearInterval(timerRef.current)
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
  }

  const handleCancel = () => {
    cleanup()
    onCancel()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && videoRef.current) {
      const resizeCanvas = () => {
        if (videoRef.current) {
          canvas.width = videoRef.current.videoWidth || 640
          canvas.height = videoRef.current.videoHeight || 480
        }
      }
      videoRef.current.addEventListener('loadedmetadata', resizeCanvas)
      resizeCanvas()
      return () => {
        videoRef.current?.removeEventListener('loadedmetadata', resizeCanvas)
      }
    }
  }, [cameraStatus])

  if (cameraStatus === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading camera...</div>
        <video ref={videoRef} autoPlay playsInline muted className={styles.videoHidden} />
        <canvas ref={canvasRef} className={styles.canvasHidden} />
      </div>
    )
  }

  if (cameraStatus === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || 'Camera access denied'}</p>
          <button className={styles.button} onClick={initializeCamera}>Try Again</button>
          <button className={styles.button} onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🍎 Fruit Ninja Challenge</h2>
      
      <div className={styles.gameArea}>
        <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
        <canvas ref={canvasRef} className={styles.canvas} />
        
        {isActive && (
          <div className={styles.gameOverlay}>
            <div className={styles.score}>🍎 Score: {score}</div>
            <div className={styles.timer}>⏱️ 0:{timeRemaining.toString().padStart(2, '0')}</div>
            <div className={styles.hits}>
              <span>❤️</span>
              <span>❤️</span>
              <span>❤️</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        {!isActive ? (
          <button className={styles.startButton} onClick={handleStart}>
            🚀 Start Challenge!
          </button>
        ) : (
          <button className={styles.stopButton} onClick={handleComplete}>
            ⏹️ Finish Early
          </button>
        )}
        <button className={styles.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
      </div>

      <div className={styles.instructions}>
        <p>💡 Wave your hands to hit the falling fruits!</p>
        <p>Move your arms up and down quickly to catch them all!</p>
      </div>
    </div>
  )
}
