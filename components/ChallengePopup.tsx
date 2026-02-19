'use client'

import { useState } from 'react'
import { Challenge, ExerciseResult } from '@/types/challenge'
import ChallengeInstructions from './ChallengeInstructions'
import CameraRecorder from './CameraRecorder'
import ExerciseVerifier from './ExerciseVerifier'
import ResultDisplay from './ResultDisplay'
import BoxingChallenge from './BoxingChallenge'
import FruitNinjaChallenge from './FruitNinjaChallenge'
import { calculateStars, calculateCoinsFromStars } from '@/utils/scoring'
import { trackEvent } from '@/utils/analytics'
import styles from './ChallengePopup.module.css'

interface ChallengePopupProps {
  challenge: Challenge
  onComplete: () => void
}

type PopupState = 'challenge' | 'instructions' | 'camera' | 'recording' | 'verifying' | 'result'

export default function ChallengePopup({ challenge, onComplete }: ChallengePopupProps) {
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

  const handleBoxingComplete = (score: number, punches: number) => {
    // Very lenient scoring - ensure everyone gets stars
    // Base score from punches - even 1 punch gives good score
    const punchScore = Math.min(100, Math.max(50, (punches / Math.max(1, challenge.duration * 0.5)) * 100))
    // Combine with hit score (more weight on punches)
    const combinedScore = Math.min(100, Math.round(punchScore * 0.7 + Math.min(score / 5, 30)))
    
    // Ensure minimum score of 50 for participation (guarantees at least 1 star)
    const normalizedScore = Math.max(50, combinedScore)
    
    const stars = calculateStars(normalizedScore)
    const coins = calculateCoinsFromStars(stars)
    
    let feedback = `Great boxing! You threw ${punches} punch${punches !== 1 ? 'es' : ''}`
    if (score > 0) {
      feedback += ` and scored ${score} points`
    }
    feedback += `! 🥊`
    
    const exerciseResult: ExerciseResult = {
      score: normalizedScore,
      stars,
      coins,
      feedback
    }
    
    setResult(exerciseResult)
    setState('result')
    trackEvent('challenge_completed', { challengeId: challenge.id })
  }

  const handleFruitNinjaComplete = (score: number, hits: number) => {
    // Calculate score based on hits and score
    const normalizedScore = Math.min(100, Math.round((hits / challenge.duration) * 60 + (score / 100) * 40))
    const stars = calculateStars(normalizedScore)
    const coins = calculateCoinsFromStars(stars)
    const feedback = `Awesome ninja skills! You hit ${hits} fruits and scored ${score} points! 🍎`
    
    const exerciseResult: ExerciseResult = {
      score: normalizedScore,
      stars,
      coins,
      feedback
    }
    
    setResult(exerciseResult)
    setState('result')
    trackEvent('challenge_completed', { challengeId: challenge.id })
  }

  const handleClose = () => {
    onComplete()
  }

  const isInteractiveChallenge = challenge.exerciseType === 'boxing' || challenge.exerciseType === 'fruit-ninja'

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {state === 'challenge' && (
          <div className={styles.challengeView}>
            <div className={styles.challengeHeader}>
              <button className={styles.closeButton} onClick={handleClose}>
                ✕
              </button>
              <span className={styles.icon}>{challenge.icon}</span>
              <h2 className={styles.challengeTitle}>{challenge.title}</h2>
              <p className={styles.challengeDescription}>{challenge.description}</p>
            </div>
            <div className={styles.challengeInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>⏱️ Duration</span>
                <span className={styles.infoValue}>{challenge.duration} seconds</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>🎯 Goal</span>
                <span className={styles.infoValue}>Complete challenge</span>
              </div>
              <div className={styles.infoItem} style={{ background: '#FEF3C7' }}>
                <span className={styles.infoLabel} style={{ color: '#D97706' }}>💎 Reward</span>
                <span className={styles.infoValue} style={{ color: '#D97706' }}>20-60 coins</span>
              </div>
            </div>
            <button className={styles.startButton} onClick={handleShowInstructions}>
              🎮 Start Challenge!
            </button>
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
