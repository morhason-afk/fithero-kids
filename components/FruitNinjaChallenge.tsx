'use client'

import { useState, useRef, useEffect } from 'react'
import { Challenge } from '@/types/challenge'
import { useLanguage } from '@/contexts/LanguageContext'
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
  onComplete: (score: number, hits: number, totalFruits: number) => void
  onCancel: () => void
}

const FRUITS = ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍉']
const OBJECT_SIZE = 60
const SPAWN_INTERVAL = 800 // milliseconds
const FALL_SPEED = 3 // pixels per frame

export default function FruitNinjaChallenge({ challenge, onComplete, onCancel }: FruitNinjaChallengeProps) {
  const { t } = useLanguage()
  const [isActive, setIsActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(challenge.duration)
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
  const handPositionsRef = useRef<{ leftWrist: { x: number; y: number } | null; rightWrist: { x: number; y: number } | null }>({
    leftWrist: null,
    rightWrist: null,
  })
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const totalFruitsSpawnedRef = useRef(0)
  const currentScoreRef = useRef(0)
  const currentHitsRef = useRef(0)
  /** Objects live in a ref so the game loop can read/update every frame without blocking on React state */
  const objectsRef = useRef<FallingObject[]>([])
  const isActiveRef = useRef(false)
  /** Brief slice effect: { x, y } shown for a few frames when fruit is hit */
  const sliceEffectsRef = useRef<{ x: number; y: number; framesLeft: number }[]>([])
  /** So we start hand updates when detector loads after game has started */
  const handLoopStartedRef = useRef(false)

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


  isActiveRef.current = isActive

  // Timer and spawn: run only when isActive changes; use end-time so we don't re-run effect every second
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current)
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
      return
    }
    const endTime = Date.now() + challenge.duration * 1000
    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
      setTimeRemaining(left)
      if (left <= 0 && timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
        handleComplete()
      }
    }, 1000)
    spawnIntervalRef.current = setInterval(() => spawnObject(), SPAWN_INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
    }
  }, [isActive])

  // Start game loop on next frame so we don't block React when isActive turns true
  useEffect(() => {
    if (!isActive || cameraStatus !== 'ready') return
    const frameId = requestAnimationFrame(() => startGameLoop())
    return () => {
      cancelAnimationFrame(frameId)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
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
      const video = videoRef.current
      if (video) {
        video.srcObject = stream
        video.muted = true
        video.playsInline = true
        await video.play().catch((e) => console.error('Video play error:', e))
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
    const w = canvas.width || 640
    const h = canvas.height || 480
    if (w < OBJECT_SIZE || h < OBJECT_SIZE) return

    totalFruitsSpawnedRef.current += 1
    const newObject: FallingObject = {
      id: objectIdCounterRef.current++,
      x: Math.random() * (w - OBJECT_SIZE),
      y: -OBJECT_SIZE,
      emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)],
      speed: 2 + Math.random() * 2,
      size: OBJECT_SIZE,
      hit: false,
    }
    objectsRef.current = [...objectsRef.current, newObject]
  }

  const startGameLoop = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const video = videoRef.current

    if (!canvas || !ctx || !video) return

    // Ensure canvas has valid dimensions (video may not have fired loadedmetadata for srcObject)
    const ensureCanvasSize = () => {
      const vw = video.videoWidth || 640
      const vh = video.videoHeight || 480
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw
        canvas.height = vh
      }
    }

    // Hand-update loop: runs in background, starts when detector is ready (may load after game start)
    const updateHands = () => {
      if (!detectorRef.current || !isActiveRef.current) return
      const vw = video.videoWidth || 0
      const vh = video.videoHeight || 0
      const cw = canvas.width || 640
      const ch = canvas.height || 480
      if (vw < 10 || vh < 10) {
        setTimeout(updateHands, 100)
        return
      }
      detectPose(detectorRef.current, video).then(pose => {
        if (!isActiveRef.current) return
        const hands = getHandPositions(pose, 0.25)
        const nw = video.videoWidth || vw
        const nh = video.videoHeight || vh
        const scaleX = (x: number) => cw - (x / nw) * cw
        const scaleY = (y: number) => (y / nh) * ch
        handPositionsRef.current = {
          leftWrist: hands.leftWrist ? { x: scaleX(hands.leftWrist.x), y: scaleY(hands.leftWrist.y) } : null,
          rightWrist: hands.rightWrist ? { x: scaleX(hands.rightWrist.x), y: scaleY(hands.rightWrist.y) } : null,
        }
        if (isActiveRef.current) setTimeout(updateHands, 80)
      }).catch(() => { if (isActiveRef.current) setTimeout(updateHands, 80) })
    }

    const gameLoop = () => {
      if (!isActiveRef.current) return

      // Start hand tracking in next tick so first detectPose() doesn't block the game frame
      if (!handLoopStartedRef.current && detectorRef.current && (video.videoWidth || 0) >= 10) {
        handLoopStartedRef.current = true
        setTimeout(updateHands, 0)
      }

      ensureCanvasSize()
      const w = canvas.width
      const h = canvas.height
      if (w === 0 || h === 0) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      ctx.clearRect(0, 0, w, h)
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        ctx.drawImage(video, 0, 0, w, h)
      }

      const hands = handPositionsRef.current
      const stillAlive: FallingObject[] = []

      objectsRef.current.forEach(obj => {
        const newY = obj.y + FALL_SPEED
        if (newY > h + obj.size) return // off screen, drop

        const centerX = obj.x + obj.size / 2
        const centerY = newY + obj.size / 2
        // Generous hit area so slicing registers easily (pose can be delayed or slightly off)
        const hitRadius = obj.size * 2
        const box = { x: centerX, y: centerY, size: hitRadius }
        let hit = false
        if (hands.leftWrist && checkCollision(hands.leftWrist, box)) hit = true
        if (hands.rightWrist && checkCollision(hands.rightWrist, box)) hit = true

        if (hit) {
          playSound('complete')
          currentScoreRef.current += 10
          currentHitsRef.current += 1
          setScore(s => s + 10)
          setHits(ht => ht + 1)
          sliceEffectsRef.current.push({ x: centerX, y: centerY, framesLeft: 8 })
          return // don't add to stillAlive - fruit is sliced
        }

        stillAlive.push({ ...obj, y: newY })
      })
      objectsRef.current = stillAlive

      // Draw fruits on top of video
      objectsRef.current.forEach(obj => {
        ctx.font = `${obj.size}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(obj.emoji, obj.x + obj.size / 2, obj.y + obj.size / 2)
      })

      // Draw slice effects (brief burst where fruit was hit)
      sliceEffectsRef.current = sliceEffectsRef.current.filter(se => {
        se.framesLeft--
        ctx.font = '28px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.globalAlpha = se.framesLeft / 8
        ctx.fillText('💥', se.x, se.y)
        ctx.globalAlpha = 1
        return se.framesLeft > 0
      })

      if (hands.leftWrist) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        ctx.beginPath()
        ctx.arc(hands.leftWrist.x, hands.leftWrist.y, 30, 0, Math.PI * 2)
        ctx.fill()
      }
      if (hands.rightWrist) {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
        ctx.beginPath()
        ctx.arc(hands.rightWrist.x, hands.rightWrist.y, 30, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()
  }

  const handleStart = () => {
    objectsRef.current = []
    sliceEffectsRef.current = []
    handPositionsRef.current = { leftWrist: null, rightWrist: null }
    handLoopStartedRef.current = false
    totalFruitsSpawnedRef.current = 0
    currentScoreRef.current = 0
    currentHitsRef.current = 0
    setIsActive(true)
    setTimeRemaining(challenge.duration)
    setScore(0)
    setHits(0)
  }

  /** Tap/click to slice. Use game area so we capture all taps; convert screen coords to canvas buffer (mirrored for scaleX(-1)). */
  const handleGameAreaPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive) return
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const relX = e.clientX - rect.left
    const relY = e.clientY - rect.top
    if (relX < 0 || relX > rect.width || relY < 0 || relY > rect.height) return
    const cw = canvas.width
    const ch = canvas.height
    if (cw <= 0 || ch <= 0) return
    const bufferX = cw * (1 - relX / rect.width)
    const bufferY = ch * (relY / rect.height)
    const point = { x: bufferX, y: bufferY }
    objectsRef.current = objectsRef.current.filter(obj => {
      const centerX = obj.x + obj.size / 2
      const centerY = obj.y + obj.size / 2
      const hitRadius = obj.size * 2
      if (checkCollision(point, { x: centerX, y: centerY, size: hitRadius })) {
        playSound('complete')
        currentScoreRef.current += 10
        currentHitsRef.current += 1
        setScore(s => s + 10)
        setHits(ht => ht + 1)
        sliceEffectsRef.current.push({ x: centerX, y: centerY, framesLeft: 8 })
        return false
      }
      return true
    })
  }

  const handleComplete = () => {
    setIsActive(false)
    onComplete(currentScoreRef.current, currentHitsRef.current, totalFruitsSpawnedRef.current)
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
    const video = videoRef.current
    if (!canvas || !video) return
    const resizeCanvas = () => {
      if (!videoRef.current) return
      const vw = videoRef.current.videoWidth || 640
      const vh = videoRef.current.videoHeight || 480
      canvas.width = vw
      canvas.height = vh
    }
    video.addEventListener('loadedmetadata', resizeCanvas)
    video.addEventListener('loadeddata', resizeCanvas)
    resizeCanvas()
    return () => {
      video.removeEventListener('loadedmetadata', resizeCanvas)
      video.removeEventListener('loadeddata', resizeCanvas)
    }
  }, [cameraStatus])

  if (cameraStatus === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || 'Camera access denied'}</p>
          <button className={styles.button} onClick={initializeCamera}>{t('Try Again')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🍎 Fruit Ninja Challenge</h2>
      
      <div
        className={styles.gameArea}
        onPointerDown={handleGameAreaPointer}
        style={{ touchAction: 'none', cursor: isActive ? 'crosshair' : 'default' }}
      >
        {cameraStatus === 'loading' && (
          <div className={styles.loadingOverlay}>{t('Loading camera...')}</div>
        )}
        <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          aria-label="Tap or click fruits to slice them"
        />
        
        {isActive && (
          <div className={styles.gameOverlay}>
            <div className={styles.score}>🍎 Score: {score}</div>
            <div className={styles.timer}>⏱️ 0:{timeRemaining.toString().padStart(2, '0')}</div>
            <div className={styles.hits}>Sliced: {hits} 🍎</div>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        {!isActive ? (
          <button className={styles.startButton} onClick={handleStart}>
            🚀 {t('Start Challenge!')}
          </button>
        ) : (
          <p className={styles.recordingHint}>{t('Complete the challenge before time runs out!')}</p>
        )}
      </div>

      <div className={styles.instructions}>
        <p>💡 Tap or click fruits to slice them — or wave your hands in front of the camera!</p>
        <p>Slice as many as you can before time runs out.</p>
      </div>
    </div>
  )
}
