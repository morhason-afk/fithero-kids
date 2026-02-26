'use client'

import { useState, useRef, useEffect } from 'react'
import { Challenge } from '@/types/challenge'
import { useLanguage } from '@/contexts/LanguageContext'
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
  onComplete: (score: number, punches: number, totalTargets: number) => void
  onCancel: () => void
}

const TARGET_EMOJIS = ['🎯', '🥊', '💥', '⭐']
const TARGET_SIZE = 100 // Larger targets for easier hits
const SPAWN_INTERVAL = 1200 // milliseconds - spawn more frequently
const TARGET_LIFETIME = 4000 // milliseconds - targets stay longer

export default function BoxingChallenge({ challenge, onComplete, onCancel }: BoxingChallengeProps) {
  const { t } = useLanguage()
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
  const totalTargetsSpawnedRef = useRef(0)
  const currentScoreRef = useRef(0)
  const currentPunchesRef = useRef(0)
  const isActiveRef = useRef(false)
  const handPositionsRef = useRef<{ leftWrist: { x: number; y: number } | null; rightWrist: { x: number; y: number } | null; leftElbow: { x: number; y: number } | null; rightElbow: { x: number; y: number } | null }>({ leftWrist: null, rightWrist: null, leftElbow: null, rightElbow: null })
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
    spawnIntervalRef.current = setInterval(() => spawnTarget(), SPAWN_INTERVAL)
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

  const spawnTarget = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    totalTargetsSpawnedRef.current += 1
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

  const startGameLoop = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const video = videoRef.current

    if (!canvas || !ctx || !video) return

    const ensureCanvasSize = () => {
      const vw = video.videoWidth || 640
      const vh = video.videoHeight || 480
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw
        canvas.height = vh
      }
    }

    // Background pose loop: do not block the game loop
    const updateHands = () => {
      if (!detectorRef.current || !isActiveRef.current) return
      const vw = video.videoWidth || 0
      const vh = video.videoHeight || 0
      if (vw < 10 || vh < 10) {
        setTimeout(updateHands, 100)
        return
      }
      detectPose(detectorRef.current, video).then(pose => {
        if (!isActiveRef.current) return
        const hands = getHandPositions(pose)
        const nw = video.videoWidth || vw
        const nh = video.videoHeight || vh
        const cw = canvas.width || 640
        const ch = canvas.height || 480
        const scaleX = (x: number) => cw - (x / nw) * cw
        const scaleY = (y: number) => (y / nh) * ch
        handPositionsRef.current = {
          leftWrist: hands.leftWrist ? { x: scaleX(hands.leftWrist.x), y: scaleY(hands.leftWrist.y) } : null,
          rightWrist: hands.rightWrist ? { x: scaleX(hands.rightWrist.x), y: scaleY(hands.rightWrist.y) } : null,
          leftElbow: hands.leftElbow ? { x: scaleX(hands.leftElbow.x), y: scaleY(hands.leftElbow.y) } : null,
          rightElbow: hands.rightElbow ? { x: scaleX(hands.rightElbow.x), y: scaleY(hands.rightElbow.y) } : null,
        }
        if (isActiveRef.current) setTimeout(updateHands, 80)
      }).catch(() => { if (isActiveRef.current) setTimeout(updateHands, 80) })
    }

    const gameLoop = () => {
      if (!isActiveRef.current) return

      ensureCanvasSize()
      if (canvas.width === 0 || canvas.height === 0) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      if (!handLoopStartedRef.current && detectorRef.current && (video.videoWidth || 0) >= 10) {
        handLoopStartedRef.current = true
        setTimeout(updateHands, 0)
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      }

      const handPositions = handPositionsRef.current

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

      setTargets(prevTargets => {
        const updatedTargets = prevTargets
          .map(target => {
            if (target.hit) return null
            const newLifetime = target.lifetime + 16
            if (newLifetime >= target.maxLifetime) return null

            let hit = false
            if (handPositions.leftWrist) {
              const distance = Math.sqrt(
                Math.pow(handPositions.leftWrist.x - (target.x + target.size / 2), 2) +
                Math.pow(handPositions.leftWrist.y - (target.y + target.size / 2), 2)
              )
              const hitRadius = target.size / 2 + 20
              if (distance < hitRadius) {
                if (previousHandPositionsRef.current.leftWrist) {
                  if (isPunching(handPositions.leftWrist, handPositions.leftElbow, previousHandPositionsRef.current.leftWrist) || distance < target.size / 2) hit = true
                } else hit = true
              }
            }
            if (!hit && handPositions.rightWrist) {
              const distance = Math.sqrt(
                Math.pow(handPositions.rightWrist.x - (target.x + target.size / 2), 2) +
                Math.pow(handPositions.rightWrist.y - (target.y + target.size / 2), 2)
              )
              const hitRadius = target.size / 2 + 20
              if (distance < hitRadius) {
                if (previousHandPositionsRef.current.rightWrist) {
                  if (isPunching(handPositions.rightWrist, handPositions.rightElbow, previousHandPositionsRef.current.rightWrist) || distance < target.size / 2) hit = true
                } else hit = true
              }
            }

            if (hit) {
              playSound('complete')
              currentScoreRef.current += 20
              currentPunchesRef.current += 1
              setScore(prev => prev + 20)
              setPunches(prev => prev + 1)
              return null
            }
            return { ...target, lifetime: newLifetime }
          })
          .filter((t): t is Target => t !== null)

        updatedTargets.forEach(target => {
          const alpha = 1 - (target.lifetime / target.maxLifetime)
          ctx.globalAlpha = alpha
          ctx.font = `${target.size}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(target.emoji, target.x + target.size / 2, target.y + target.size / 2)
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(target.x + target.size / 2, target.y + target.size / 2, target.size / 2, 0, Math.PI * 2)
          ctx.stroke()
          ctx.globalAlpha = 1
        })
        return updatedTargets
      })

      previousHandPositionsRef.current = {
        leftWrist: handPositions.leftWrist,
        rightWrist: handPositions.rightWrist,
      }

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

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()
  }

  const handleStart = () => {
    handLoopStartedRef.current = false
    handPositionsRef.current = { leftWrist: null, rightWrist: null, leftElbow: null, rightElbow: null }
    previousHandPositionsRef.current = { leftWrist: null, rightWrist: null }
    setIsActive(true)
    setTimeRemaining(challenge.duration)
    setScore(0)
    setPunches(0)
    setMovementCount(0)
    setTargets([])
    totalTargetsSpawnedRef.current = 0
    currentScoreRef.current = 0
    currentPunchesRef.current = 0
  }

  const handleComplete = () => {
    setIsActive(false)
    const totalTargets = totalTargetsSpawnedRef.current
    const finalScore = currentScoreRef.current
    const finalPunches = currentPunchesRef.current
    onComplete(finalScore, finalPunches, totalTargets)
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
      <h2 className={styles.title}>🥊 Boxing Challenge</h2>
      
      <div className={styles.gameArea}>
        {cameraStatus === 'loading' && (
          <div className={styles.loadingOverlay}>{t('Loading camera...')}</div>
        )}
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
            🚀 {t('Start Challenge!')}
          </button>
        ) : (
          <p className={styles.recordingHint}>{t('Complete the challenge before time runs out!')}</p>
        )}
      </div>

      <div className={styles.instructions}>
        <p>💡 Throw punches at the targets!</p>
        <p>Extend your arms quickly to hit them!</p>
      </div>
    </div>
  )
}
