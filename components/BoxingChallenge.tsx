'use client'

import { useState, useRef, useEffect } from 'react'
import { Challenge } from '@/types/challenge'
import { initializePoseDetector, detectPose, getHandPositions, isPunching, isHandMoving } from '@/utils/poseDetection'
import { playSound } from '@/utils/sounds'
import styles from './BoxingChallenge.module.css'

interface Target {
  id: number
  x: number
  y: number
  emoji: string
  size: number
  hit: boolean
  lifetime: number
  maxLifetime: number
}

interface BoxingChallengeProps {
  challenge: Challenge
  onComplete: (score: number, punches: number) => void
  onCancel: () => void
}

const TARGET_EMOJIS = ['🎯', '🥊', '💥', '⭐']
const TARGET_SIZE = 100 // Larger targets for easier hits
const SPAWN_INTERVAL = 1200 // milliseconds - spawn more frequently
const TARGET_LIFETIME = 4000 // milliseconds - targets stay longer

export default function BoxingChallenge({ challenge, onComplete, onCancel }: BoxingChallengeProps) {
  const [isActive, setIsActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(challenge.duration)
  const [targets, setTargets] = useState<Target[]>([])
  const [score, setScore] = useState(0)
  const [punches, setPunches] = useState(0)
  const [movementCount, setMovementCount] = useState(0) // Track any hand movement as fallback
  const [cameraStatus, setCameraStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const detectorRef = useRef<any>(null)
  const targetIdCounterRef = useRef(0)
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
        spawnTarget()
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

  const spawnTarget = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const newTarget: Target = {
      id: targetIdCounterRef.current++,
      x: Math.random() * (canvas.width - TARGET_SIZE),
      y: Math.random() * (canvas.height - TARGET_SIZE),
      emoji: TARGET_EMOJIS[Math.floor(Math.random() * TARGET_EMOJIS.length)],
      size: TARGET_SIZE,
      hit: false,
      lifetime: 0,
      maxLifetime: TARGET_LIFETIME,
    }

    setTargets(prev => [...prev, newTarget])
  }

  const startGameLoop = async () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const video = videoRef.current

    if (!canvas || !ctx || !video || !detectorRef.current) return

    const gameLoop = async () => {
      if (!isActive) return

      // Update and draw targets
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Detect pose and get hand positions
      const pose = await detectPose(detectorRef.current, video)
      let handPositions = getHandPositions(pose)
      
      // Track movement for fallback scoring
      if (handPositions.leftWrist && previousHandPositionsRef.current.leftWrist) {
        if (isHandMoving(handPositions.leftWrist, previousHandPositionsRef.current.leftWrist, 5)) {
          setMovementCount(prev => prev + 1)
        }
      }
      if (handPositions.rightWrist && previousHandPositionsRef.current.rightWrist) {
        if (isHandMoving(handPositions.rightWrist, previousHandPositionsRef.current.rightWrist, 5)) {
          setMovementCount(prev => prev + 1)
        }
      }
      
      // Scale hand positions to canvas coordinates
      if (video.videoWidth && video.videoHeight) {
        if (handPositions.leftWrist) {
          handPositions.leftWrist = {
            x: (handPositions.leftWrist.x / video.videoWidth) * canvas.width,
            y: (handPositions.leftWrist.y / video.videoHeight) * canvas.height,
          }
        }
        if (handPositions.rightWrist) {
          handPositions.rightWrist = {
            x: (handPositions.rightWrist.x / video.videoWidth) * canvas.width,
            y: (handPositions.rightWrist.y / video.videoHeight) * canvas.height,
          }
        }
        if (handPositions.leftElbow) {
          handPositions.leftElbow = {
            x: (handPositions.leftElbow.x / video.videoWidth) * canvas.width,
            y: (handPositions.leftElbow.y / video.videoHeight) * canvas.height,
          }
        }
        if (handPositions.rightElbow) {
          handPositions.rightElbow = {
            x: (handPositions.rightElbow.x / video.videoWidth) * canvas.width,
            y: (handPositions.rightElbow.y / video.videoHeight) * canvas.height,
          }
        }
      }

      // Update targets and check collisions
      setTargets(prevTargets => {
        const updatedTargets = prevTargets
          .map(target => {
            if (target.hit) return null

            // Update lifetime
            const newLifetime = target.lifetime + 16 // ~60fps
            if (newLifetime >= target.maxLifetime) {
              return null // Target expired
            }

            // Check for punches hitting targets - simplified detection
            let hit = false
            
            // Check left hand
            if (handPositions.leftWrist) {
              const distance = Math.sqrt(
                Math.pow(handPositions.leftWrist.x - (target.x + target.size / 2), 2) +
                Math.pow(handPositions.leftWrist.y - (target.y + target.size / 2), 2)
              )
              
              // Larger hit radius for easier hits
              const hitRadius = target.size / 2 + 20
              
              if (distance < hitRadius) {
                // If hand is moving or extended, count as hit
                if (previousHandPositionsRef.current.leftWrist) {
                  const isMoving = isPunching(
                    handPositions.leftWrist,
                    handPositions.leftElbow,
                    previousHandPositionsRef.current.leftWrist
                  )
                  if (isMoving || distance < target.size / 2) {
                    hit = true
                  }
                } else {
                  // First frame - just check proximity
                  hit = true
                }
              }
            }

            // Check right hand
            if (!hit && handPositions.rightWrist) {
              const distance = Math.sqrt(
                Math.pow(handPositions.rightWrist.x - (target.x + target.size / 2), 2) +
                Math.pow(handPositions.rightWrist.y - (target.y + target.size / 2), 2)
              )
              
              // Larger hit radius for easier hits
              const hitRadius = target.size / 2 + 20
              
              if (distance < hitRadius) {
                // If hand is moving or extended, count as hit
                if (previousHandPositionsRef.current.rightWrist) {
                  const isMoving = isPunching(
                    handPositions.rightWrist,
                    handPositions.rightElbow,
                    previousHandPositionsRef.current.rightWrist
                  )
                  if (isMoving || distance < target.size / 2) {
                    hit = true
                  }
                } else {
                  // First frame - just check proximity
                  hit = true
                }
              }
            }

            if (hit) {
              playSound('complete')
              setScore(prev => prev + 20)
              setPunches(prev => prev + 1)
              return null
            }

            return { ...target, lifetime: newLifetime }
          })
          .filter((target): target is Target => target !== null)

        // Draw targets
        updatedTargets.forEach(target => {
          const alpha = 1 - (target.lifetime / target.maxLifetime)
          ctx.globalAlpha = alpha
          ctx.font = `${target.size}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(
            target.emoji,
            target.x + target.size / 2,
            target.y + target.size / 2
          )
          
          // Draw target circle
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(
            target.x + target.size / 2,
            target.y + target.size / 2,
            target.size / 2,
            0,
            Math.PI * 2
          )
          ctx.stroke()
          ctx.globalAlpha = 1
        })

        return updatedTargets
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

      previousHandPositionsRef.current = {
        leftWrist: handPositions.leftWrist,
        rightWrist: handPositions.rightWrist,
      }
      
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()
  }

  const handleStart = () => {
    setIsActive(true)
    setTimeRemaining(challenge.duration)
    setScore(0)
    setPunches(0)
    setMovementCount(0)
    setTargets([])
  }

  const handleComplete = () => {
    setIsActive(false)
    // Use movement count as fallback if punches are low
    const finalPunches = punches > 0 ? punches : Math.floor(movementCount / 10)
    const finalScore = score > 0 ? score : Math.floor(movementCount * 2)
    onComplete(finalScore, finalPunches)
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
      <h2 className={styles.title}>🥊 Boxing Challenge</h2>
      
      <div className={styles.gameArea}>
        <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
        <canvas ref={canvasRef} className={styles.canvas} />
        
        {isActive && (
          <div className={styles.gameOverlay}>
            <div className={styles.score}>⭐ {score}</div>
            <div className={styles.timer}>0:{timeRemaining.toString().padStart(2, '0')}</div>
            <div className={styles.punches}>COMBO x{punches} 🔥</div>
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
        <p>💡 Throw punches at the targets!</p>
        <p>Extend your arms quickly to hit them!</p>
      </div>
    </div>
  )
}
