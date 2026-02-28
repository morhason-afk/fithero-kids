'use client'

import { useState, useEffect } from 'react'
import { Challenge, ExerciseResult } from '@/types/challenge'
import { useLanguage } from '@/contexts/LanguageContext'
import ChallengeInstructions from './ChallengeInstructions'
import CameraRecorder from './CameraRecorder'
import ExerciseVerifier from './ExerciseVerifier'
import ResultDisplay from './ResultDisplay'
import BoxingChallenge from './BoxingChallenge'
import JumpsChallenge from './JumpsChallenge'
import { calculateStarsFromCompliance, calculateCoinsFromStars } from '@/utils/scoring'
import { trackEvent } from '@/utils/analytics'
import styles from './ChallengePopup.module.css'

interface ChallengePopupProps {
  challenge: Challenge
  onComplete: () => void
}

type PopupState = 'challenge' | 'instructions' | 'camera' | 'recording' | 'verifying' | 'result'

export default function ChallengePopup({ challenge, onComplete }: ChallengePopupProps) {
  const { t } = useLanguage()
  const [state, setState] = useState<PopupState>('challenge')
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [result, setResult] = useState<ExerciseResult | null>(null)

  const handleShowInstructions = () => {
    setState('instructions')
  }

  const handleStartRecording = () => {
    setState('camera')
  }

  const handleVideoRecorded = (blob: Blob) => {
    setVideoBlob(blob)
    setState('verifying')
  }

  const handleVerificationComplete = (exerciseResult: ExerciseResult) => {
    setResult(exerciseResult)
    setState('result')
    trackEvent('challenge_completed', { challengeId: challenge.id })
  }

  const handleBoxingComplete = (score: number, punches: number, totalTargets: number) => {
    const isPunchCountOnly = totalTargets <= 1
    let stars: number
    let feedback: string

    if (isPunchCountOnly) {
      if (punches === 0) {
        stars = 0
        feedback = t("You didn't throw any punches. Throw punches at the camera! Try again. 🥊")
      } else if (punches >= 16) {
        stars = 3
        feedback = t(`Amazing! You threw ${punches} punches! Perfect boxing! 🌟`)
      } else if (punches >= 6) {
        stars = 2
        feedback = t(`Great job! You threw ${punches} punches. Keep it up! 👏`)
      } else {
        stars = 1
        feedback = t(`You threw ${punches} punches. Throw more next time for more stars! 💪`)
      }
    } else {
      const opportunities = Math.max(1, totalTargets)
      const compliance = punches / opportunities
      if (compliance < 0.5) {
        setResult({
          score: Math.round(compliance * 100),
          stars: 0,
          coins: 0,
          feedback: t("You didn't do the challenge as instructed. Throw punches at the targets! Try again. 🥊")
        })
        setState('result')
        trackEvent('challenge_completed', { challengeId: challenge.id })
        return
      }
      stars = calculateStarsFromCompliance(compliance)
      const pct = Math.round(compliance * 100)
      feedback = stars >= 3
        ? t(`Amazing! You hit ${punches} of ${totalTargets} targets (${pct}%)! 🌟`)
        : stars === 2
          ? t(`Great job! You hit ${punches} of ${totalTargets} targets (${pct}%). 👏`)
          : t(`You hit ${punches} of ${totalTargets} targets. Try again! 💪`)
    }

    const coins = calculateCoinsFromStars(stars)
    setResult({
      score: Math.min(100, Math.round(score)),
      stars,
      coins,
      feedback
    })
    setState('result')
    trackEvent('challenge_completed', { challengeId: challenge.id })
  }

  const handleJumpsComplete = (jumpCount: number) => {
    let stars: number
    let feedback: string
    if (jumpCount === 0) {
      stars = 0
      feedback = t("We didn't detect any jumps. Jump in place! Try again. ⬆️")
    } else if (jumpCount >= 20) {
      stars = 3
      feedback = t(`Amazing! You did ${jumpCount} jumps! 🌟`)
    } else if (jumpCount >= 10) {
      stars = 2
      feedback = t(`Great job! You did ${jumpCount} jumps. 👏`)
    } else {
      stars = 1
      feedback = t(`You did ${jumpCount} jumps. Jump more for more stars! 💪`)
    }
    const score = Math.min(100, jumpCount * 5)
    const coins = calculateCoinsFromStars(stars)
    setResult({ score, stars, coins, feedback })
    setState('result')
    trackEvent('challenge_completed', { challengeId: challenge.id })
  }

  const handleClose = () => {
    onComplete()
  }

  const isInteractiveChallenge = challenge.exerciseType === 'boxing' || challenge.exerciseType === 'jumps'

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {state === 'challenge' && (
          <div className={styles.challengeView}>
            <div className={styles.challengeHeader}>
              <button className={styles.closeButton} onClick={handleClose}>
                ✕
              </button>
              <span className={styles.icon}>{challenge.icon}</span>
              <h2 className={styles.challengeTitle}>{t(challenge.title)}</h2>
              <p className={styles.challengeDescription}>{t(challenge.description)}</p>
            </div>
            <div className={styles.challengeInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>⏱️ {t('Duration')}</span>
                <span className={styles.infoValue}>{challenge.duration}{t(' seconds')}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>🎯 {t('Goal')}</span>
                <span className={styles.infoValue}>
                  {challenge.exerciseType === 'boxing'
                    ? t('Throw as many punches as you can')
                    : challenge.exerciseType === 'jumps'
                      ? t('Jump in place as many times as you can')
                      : t('Complete challenge')}
                </span>
              </div>
              <div className={styles.infoItem} style={{ background: '#FEF3C7' }}>
                <span className={styles.infoLabel} style={{ color: '#D97706' }}>💎 {t('Reward')}</span>
                <span className={styles.infoValue} style={{ color: '#D97706' }}>{t('20-60 diamonds')}</span>
              </div>
            </div>
            <div className={styles.startButtonWrap}>
              <button className={styles.startButton} onClick={handleShowInstructions}>
                🎮 {t('Start Challenge!')}
              </button>
            </div>
          </div>
        )}

        {state === 'instructions' && (
          <ChallengeInstructions
            challenge={challenge}
            onContinue={handleStartRecording}
            onBack={() => setState('challenge')}
          />
        )}

        {state === 'camera' && challenge.exerciseType === 'boxing' && (
          <BoxingChallenge
            challenge={challenge}
            onComplete={handleBoxingComplete}
            onCancel={() => setState('challenge')}
          />
        )}

        {state === 'camera' && challenge.exerciseType === 'jumps' && (
          <JumpsChallenge
            challenge={challenge}
            onComplete={handleJumpsComplete}
            onCancel={() => setState('challenge')}
          />
        )}

        {state === 'camera' && !isInteractiveChallenge && (
          <CameraRecorder
            challenge={challenge}
            onVideoRecorded={handleVideoRecorded}
            onCancel={() => setState('challenge')}
          />
        )}

        {state === 'verifying' && videoBlob && (
          <ExerciseVerifier
            challenge={challenge}
            videoBlob={videoBlob}
            onVerificationComplete={handleVerificationComplete}
          />
        )}

        {state === 'result' && result && (
          <ResultDisplay
            result={result}
            challenge={challenge}
            videoBlob={videoBlob}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  )
}
