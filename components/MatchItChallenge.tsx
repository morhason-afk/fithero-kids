'use client'

import { useState, useRef, useEffect } from 'react'
import { Challenge } from '@/types/challenge'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './MatchItChallenge.module.css'

/** Stick-figure shapes the kid must match with their body */
const SHAPES = [
  {
    id: 't',
    nameKey: 'Arms out like T',
    nameFallback: 'Arms out like T',
    svg: (
      <svg viewBox="0 0 120 140" className={styles.shapeSvg} aria-hidden>
        <circle cx="60" cy="22" r="14" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="36" x2="60" y2="75" stroke="currentColor" strokeWidth="4" />
        <line x1="20" y1="45" x2="100" y2="45" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="75" x2="40" y2="120" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="75" x2="80" y2="120" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: 'y',
    nameKey: 'Arms up like Y',
    nameFallback: 'Arms up like Y',
    svg: (
      <svg viewBox="0 0 120 140" className={styles.shapeSvg} aria-hidden>
        <circle cx="60" cy="22" r="14" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="36" x2="60" y2="70" stroke="currentColor" strokeWidth="4" />
        <line x1="35" y1="50" x2="60" y2="70" stroke="currentColor" strokeWidth="4" />
        <line x1="85" y1="50" x2="60" y2="70" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="70" x2="45" y2="120" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="70" x2="75" y2="120" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: 'x',
    nameKey: 'Big X with arms and legs',
    nameFallback: 'Big X with arms and legs',
    svg: (
      <svg viewBox="0 0 120 140" className={styles.shapeSvg} aria-hidden>
        <circle cx="60" cy="35" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="47" x2="60" y2="75" stroke="currentColor" strokeWidth="4" />
        <line x1="25" y1="30" x2="95" y2="95" stroke="currentColor" strokeWidth="4" />
        <line x1="95" y1="30" x2="25" y2="95" stroke="currentColor" strokeWidth="4" />
        <line x1="35" y1="110" x2="60" y2="75" stroke="currentColor" strokeWidth="4" />
        <line x1="85" y1="110" x2="60" y2="75" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: 'star',
    nameKey: 'Star pose',
    nameFallback: 'Star pose',
    svg: (
      <svg viewBox="0 0 120 140" className={styles.shapeSvg} aria-hidden>
        <circle cx="60" cy="25" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="37" x2="60" y2="72" stroke="currentColor" strokeWidth="4" />
        <line x1="30" y1="55" x2="60" y2="72" stroke="currentColor" strokeWidth="4" />
        <line x1="90" y1="55" x2="60" y2="72" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="72" x2="40" y2="118" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="72" x2="80" y2="118" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: 'o',
    nameKey: 'Hold a big circle',
    nameFallback: 'Hold a big circle',
    svg: (
      <svg viewBox="0 0 120 140" className={styles.shapeSvg} aria-hidden>
        <circle cx="60" cy="28" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
        <ellipse cx="60" cy="75" rx="38" ry="32" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="52" x2="45" y2="65" stroke="currentColor" strokeWidth="3" />
        <line x1="60" y1="52" x2="75" y2="65" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
] as const

interface MatchItChallengeProps {
  challenge: Challenge
  onComplete: (score: number) => void
  onCancel: () => void
}

export default function MatchItChallenge({ challenge, onComplete, onCancel }: MatchItChallengeProps) {
  const { t } = useLanguage()
  const [isActive, setIsActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(challenge.duration)
  const [cameraStatus, setCameraStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [currentShape, setCurrentShape] = useState<typeof SHAPES[number] | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    initializeCamera()
    return () => cleanup()
  }, [])

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

  const initializeCamera = async () => {
    try {
      setCameraStatus('loading')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
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
    } catch (err: unknown) {
      console.error('Error accessing camera:', err)
      setCameraStatus('error')
      setError('Could not access camera. Please check permissions.')
    }
  }

  const handleStart = () => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    setCurrentShape(shape)
    setIsActive(true)
    setTimeRemaining(challenge.duration)
  }

  const handleComplete = () => {
    setIsActive(false)
    const score = Math.min(100, 80 + Math.floor(Math.random() * 21))
    onComplete(score)
  }

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const handleCancel = () => {
    cleanup()
    onCancel()
  }

  if (cameraStatus === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || t('Camera access denied')}</p>
          <button className={styles.button} onClick={initializeCamera}>
            {t('Try Again')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>🔷 {t('Match it!')}</h2>
        <button type="button" className={styles.cancelButton} onClick={handleCancel} aria-label={t('Cancel')}>
          ✕
        </button>
      </div>

      <div className={styles.gameArea}>
        {cameraStatus === 'loading' && (
          <div className={styles.loadingOverlay}>{t('Loading camera...')}</div>
        )}
        <video ref={videoRef} autoPlay playsInline muted className={styles.video} />

        {isActive && currentShape && (
          <div className={styles.shapeOverlay} role="img" aria-label={t(currentShape.nameKey)}>
            <div className={styles.shapeCard}>
              <p className={styles.shapeLabel}>{t('Match this shape!')}</p>
              <div className={styles.shapeFigure}>{currentShape.svg}</div>
              <p className={styles.shapeName}>{t(currentShape.nameKey)}</p>
            </div>
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
          <p className={styles.recordingHint}>{t('Use your body to match the shape!')}</p>
        )}
      </div>

      <div className={styles.instructions}>
        <p>💡 {t('Look at the shape on screen. Use your arms and body to make the same shape!')}</p>
      </div>
    </div>
  )
}
