'use client'

import { useState, useEffect } from 'react'
import { Challenge, ExerciseResult } from '@/types/challenge'
import { calculateStars, calculateCoinsFromStars } from '@/utils/scoring'
import styles from './ExerciseVerifier.module.css'

interface ExerciseVerifierProps {
  challenge: Challenge
  videoBlob: Blob
  onVerificationComplete: (result: ExerciseResult) => void
}

export default function ExerciseVerifier({ challenge, videoBlob, onVerificationComplete }: ExerciseVerifierProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Analyzing your exercise...')

  useEffect(() => {
    // Simulate exercise verification process
    // In a real implementation, this would use pose detection (TensorFlow.js, MediaPipe, etc.)
    verifyExercise()
  }, [])

  const verifyExercise = async () => {
    // Simulate analysis progress
    const steps = [
      { progress: 20, status: 'Loading video...' },
      { progress: 40, status: 'Detecting movements...' },
      { progress: 60, status: 'Analyzing form...' },
      { progress: 80, status: 'Calculating score...' },
      { progress: 100, status: 'Complete!' }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setProgress(step.progress)
      setStatus(step.status)
    }

    // Simulate exercise verification
    // In production, this would use actual pose detection and movement analysis
    const score = calculateScore(challenge, videoBlob)
    const stars = calculateStars(score)
    const coins = calculateCoinsFromStars(stars)
    const feedback = generateFeedback(score, stars, challenge)

    const result: ExerciseResult = {
      score,
      stars,
      coins,
      feedback
    }

    // Small delay before showing results
    await new Promise(resolve => setTimeout(resolve, 500))
    onVerificationComplete(result)
  }

  const calculateScore = (challenge: Challenge, videoBlob: Blob): number => {
    // Simulated scoring algorithm
    // In production, this would analyze:
    // - Movement quality (pose detection)
    // - Exercise completion (repetition counting)
    // - Form correctness
    // - Duration adherence
    
    // For now, return a random score between 60-100 to simulate different performance levels
    const baseScore = 60 + Math.random() * 40
    
    // Adjust based on difficulty
    const difficultyMultiplier = {
      easy: 1.0,
      medium: 0.95,
      hard: 0.90
    }
    
    return Math.round(baseScore * difficultyMultiplier[challenge.difficulty])
  }

  const generateFeedback = (score: number, stars: number, challenge: Challenge): string => {
    if (stars === 3) {
      return `Amazing work! You got ${stars} stars on ${challenge.title}! 🌟`
    } else if (stars === 2) {
      return `Great job! You got ${stars} stars on ${challenge.title}! 👏`
    } else if (stars === 1) {
      return `Good effort! You got ${stars} star on ${challenge.title}! 💪`
    } else {
      return `Keep practicing ${challenge.title} to earn stars! 🚀`
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loadingAnimation}>
        <div className={styles.spinner}>
          <div className={styles.spinnerInner}>🔍</div>
        </div>
      </div>
      
      <h3 className={styles.title}>Checking your moves...</h3>
      <p className={styles.status}>{status}</p>
      
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className={styles.progressText}>{progress}%</div>
      </div>

      <div className={styles.dots}>
        <div className={styles.dot} style={{ animationDelay: '0s' }}></div>
        <div className={styles.dot} style={{ animationDelay: '0.1s' }}></div>
        <div className={styles.dot} style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )
}
