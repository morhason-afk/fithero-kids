'use client'

import { useState, useEffect } from 'react'
import { Challenge, ExerciseResult } from '@/types/challenge'
import { useLanguage } from '@/contexts/LanguageContext'
import ChallengeInstructions from './ChallengeInstructions'
import CameraRecorder from './CameraRecorder'
import ExerciseVerifier from './ExerciseVerifier'
import ResultDisplay from './ResultDisplay'
import BoxingChallenge from './BoxingChallenge'
import FruitNinjaChallenge from './FruitNinjaChallenge'
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
    const opportunities = Math.max(1, totalTargets)
    const compliance = punches / opportunities

    if (compliance < 0.5) {
      const exerciseResult: ExerciseResult = {
        score: Math.round(compliance * 100),
        stars: 0,
        coins: 0,
        feedback: "You didn't do the challenge as instructed. Throw punches at the targets when they appear! Try again. 🥊"
      }
      setResult(exerciseResult)
      setState('result')
      trackEvent('challenge_completed', { challengeId: challenge.id })
      return
    }

    const stars = calculateStarsFromCompliance(compliance)
    const coins = calculateCoinsFromStars(stars)
    const pct = Math.round(compliance * 100)
    const feedback = stars >= 3
      ? `Amazing! You hit ${punches} of ${totalTargets} targets (${pct}%)! Perfect boxing! 🌟`
      : stars === 2
        ? `Great job! You hit ${punches} of ${totalTargets} targets (${pct}%). Keep it up! 👏`
        : `You hit ${punches} of ${totalTargets} targets. Follow the instructions more closely to earn more stars. Try again! 💪`

    setResult({
      score: Math.round(compliance * 100),
      stars,
      coins,
      feedback
    })
    setState('result')
    trackEvent('challenge_completed', { challengeId: challenge.id })
  }

  const handleFruitNinjaComplete = (score: number, hits: number, totalFruits: number) => {
    const opportunities = Math.max(1, totalFruits)
    const compliance = Math.min(1, hits / opportunities)

    let stars: number
    let feedback: string
    const pct = Math.round(compliance * 100)

    if (hits === 0) {
      stars = 0
      feedback = "You didn't slice any fruits. Tap or click on the fruits, or wave your hands at them! Try again. 🍎"
    } else if (compliance >= 0.9) {
      stars = 3
      feedback = `Amazing! You sliced ${hits} of ${totalFruits} fruits (${pct}%)! Perfect ninja! 🌟`
    } else if (compliance >= 0.7) {
      stars = 2
      feedback = `Great job! You sliced ${hits} of ${totalFruits} fruits (${pct}%). Keep it up! 👏`
    } else if (compliance >= 0.5 || hits >= 1) {
      stars = 1
      feedback = compliance >= 0.5
        ? `You sliced ${hits} of ${totalFruits} fruits (${pct}%). Slice more to earn more stars! 💪`
        : `You sliced ${hits} of ${totalFruits} fruits. Nice start! Slice more next time for more stars. 🍎`
    } else {
      stars = 0
      feedback = "You didn't do the challenge as instructed. Slice the fruits by tapping or waving your hands! Try again. 🍎"
    }

    const coins = calculateCoinsFromStars(stars)
    setResult({
      score: Math.round(compliance * 100),
      stars,
      coins,
      feedback
    })
    setState('result')
    trackEvent('challenge_completed', { challengeId: challenge.id })
  }

  const handleClose = () => {
    onComplete()
  }

  const isInteractiveChallenge = challenge.exerciseType === 'boxing' || challenge.exerciseType === 'fruit-ninja'

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
                    ? t('Hit at least 50% of targets with punches')
                    : challenge.exerciseType === 'fruit-ninja'
                      ? t('Slice at least 50% of fruits with your hands')
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

        {state === 'camera' && challenge.exerciseType === 'fruit-ninja' && (
          <FruitNinjaChallenge
            challenge={challenge}
            onComplete={handleFruitNinjaComplete}
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
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  )
}
