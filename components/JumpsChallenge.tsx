'use client'

import { useState, useRef, useEffect } from 'react'
import { Challenge } from '@/types/challenge'
import { useLanguage } from '@/contexts/LanguageContext'
import { initializePoseDetector, detectPose, getBodyCenterY } from '@/utils/poseDetection'
import { playSound } from '@/utils/sounds'
import styles from './BoxingChallenge.module.css'

interface JumpsChallengeProps {
  challenge: Challenge
  onComplete: (jumpCount: number) => void
  onCancel: () => void
}

const JUMP_THRESHOLD = 25
const LAND_DEBOUNCE_MS = 400

export default function JumpsChallenge({ challenge, onComplete, onCancel }: JumpsChallengeProps) {
  const { t } = useLanguage()
  const [isActive, setIsActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(challenge.duration)
  const [jumps, setJumps] = useState(0)
  const [cameraStatus, setCameraStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const detectorRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const jumpsRef = useRef(0)
  const baselineYRef = useRef<number | null>(null)
  const inAirRef = useRef(false)
  const lastLandTimeRef = useRef(0)
  const isActiveRef = useRef(false)

  useEffect(() => {
    initializeCamera()
    return () => cleanup()
  }, [])

  useEffect(() => {
    if (cameraStatus === 'ready' && videoRef.current) {
      initializePoseDetector().then(detector => {
        detectorRef.current = detector
      })
    }
  }, [cameraStatus])

  isActiveRef.current = isActive

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current)
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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive])

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

    const updatePose = () => {
      if (!detectorRef.current || !isActiveRef.current) return
      const vw = video.videoWidth || 0
      const vh = video.videoHeight || 0
      if (vw < 10 || vh < 10) {
        setTimeout(updatePose, 100)
        return
      }
      detectPose(detectorRef.current, video).then(pose => {
        if (!isActiveRef.current) return
        const bodyY = getBodyCenterY(pose)
        if (bodyY != null) {
          if (baselineYRef.current == null) {
            baselineYRef.current = bodyY
          } else {
            const baseline = baselineYRef.current
            if (bodyY < baseline - JUMP_THRESHOLD) {
              inAirRef.current = true
            } else if (inAirRef.current && bodyY >= baseline - JUMP_THRESHOLD / 2) {
              const now = Date.now()
              if (now - lastLandTimeRef.current > LAND_DEBOUNCE_MS) {
                inAirRef.current = false
                lastLandTimeRef.current = now
                jumpsRef.current += 1
                setJumps(jumpsRef.current)
                playSound('complete')
              }
            }
          }
        }
        if (isActiveRef.current) setTimeout(updatePose, 100)
      }).catch(() => { if (isActiveRef.current) setTimeout(updatePose, 100) })
    }

    const gameLoop = () => {
      if (!isActiveRef.current) return
      ensureCanvasSize()
      if (canvas.width === 0 || canvas.height === 0) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      }
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    updatePose()
    gameLoop()
  }

  const handleStart = () => {
    baselineYRef.current = null
    inAirRef.current = false
    lastLandTimeRef.current = 0
    jumpsRef.current = 0
    setIsActive(true)
    setTimeRemaining(challenge.duration)
    setJumps(0)
  }

  const handleComplete = () => {
    setIsActive(false)
    onComplete(jumpsRef.current)
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
      <h2 className={styles.title}>⬆️ {t('Jumps')}</h2>

      <div className={styles.gameArea}>
        {cameraStatus === 'loading' && (
          <div className={styles.loadingOverlay}>{t('Loading camera...')}</div>
        )}
        <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
        <canvas ref={canvasRef} className={styles.canvas} />

        {isActive && (
          <div className={styles.gameOverlay}>
            <div className={styles.punches}>⬆️ {jumps}</div>
            <div className={styles.timer}>0:{timeRemaining.toString().padStart(2, '0')}</div>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        {!isActive ? (
          <button className={styles.startButton} onClick={handleStart}>
            🚀 {t('Start Challenge!')}
          </button>
        ) : (
          <p className={styles.recordingHint}>{t('Jump in place! We count every jump.')}</p>
        )}
      </div>

      <div className={styles.instructions}>
        <p>💡 {t('Jump in place as many times as you can!')}</p>
      </div>
    </div>
  )
}
