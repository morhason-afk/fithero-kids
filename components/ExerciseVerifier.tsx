'use client'

import { useState, useEffect } from 'react'
import { Challenge, ExerciseResult } from '@/types/challenge'
import { useLanguage } from '@/contexts/LanguageContext'
import { calculateStars, calculateCoinsFromStars } from '@/utils/scoring'
import styles from './ExerciseVerifier.module.css'

interface ExerciseVerifierProps {
  challenge: Challenge
  videoBlob: Blob
  onVerificationComplete: (result: ExerciseResult) => void
}

export default function ExerciseVerifier({ challenge, videoBlob, onVerificationComplete }: ExerciseVerifierProps) {
  const { t } = useLanguage()
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

    // Analyze video for motion and score accordingly
    const score = await calculateScore(challenge, videoBlob)
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

  const estimateMotionFromVideo = (blob: Blob): Promise<number> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob)
      const video = document.createElement('video')
      video.muted = true
      video.playsInline = true
      video.preload = 'metadata'

      const canvas = document.createElement('canvas')
      canvas.width = 64
      canvas.height = 48
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        resolve(0)
        return
      }

      let prevData: Uint8ClampedArray | null = null
      let totalMotion = 0
      let sampleCount = 0

      video.onloadeddata = () => {
        const duration = video.duration
        if (!duration || duration < 1) {
          URL.revokeObjectURL(url)
          resolve(0)
          return
        }
        let time = 0.5
        const step = Math.max(0.5, (duration - 1) / 5)

        const sample = () => {
          if (time >= duration - 0.5 || sampleCount >= 6) {
            URL.revokeObjectURL(url)
            resolve(sampleCount > 0 ? totalMotion / sampleCount : 0)
            return
          }
          video.currentTime = time
        }

        video.onseeked = () => {
          try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
            if (prevData && prevData.length === data.length) {
              let sum = 0
              for (let i = 0; i < data.length; i += 4) {
                sum += Math.abs(data[i] - prevData[i]) + Math.abs(data[i + 1] - prevData[i + 1]) + Math.abs(data[i + 2] - prevData[i + 2])
              }
              totalMotion += sum / (data.length / 4) / 3
              sampleCount++
            }
            prevData = data.slice(0)
          } catch {
            // ignore
          }
          time += step
          sample()
        }

        sample()
      }

      video.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(0)
      }

      video.src = url
      video.load()
    })
  }

  const calculateScore = async (challenge: Challenge, videoBlob: Blob): Promise<number> => {
    const motionLevel = await estimateMotionFromVideo(videoBlob)
    const hasMeaningfulMotion = motionLevel >= 2.5

    if (!hasMeaningfulMotion) {
      return Math.round(25 + Math.random() * 20)
    }

    const baseScore = 60 + Math.random() * 40
    const difficultyMultiplier = {
      easy: 1.0,
      medium: 0.95,
      hard: 0.90
    }
    return Math.round(baseScore * difficultyMultiplier[challenge.difficulty])
  }

  const generateFeedback = (score: number, stars: number, challenge: Challenge): string => {
    if (stars >= 3) {
      return `Amazing! You did the exercise as instructed. You got ${stars} stars on ${challenge.title}! 🌟`
    }
    if (stars === 2) {
      return `Great job! You did the exercise well. You got ${stars} stars on ${challenge.title}! 👏`
    }
    if (stars === 1) {
      return `You're getting there! Follow the instructions more closely to earn more stars. Try again! 💪`
    }
    return `You didn't do the challenge as instructed. Move more and follow the instructions! Try again. 🚀`
  }

  return (
    <div className={styles.container}>
      <div className={styles.loadingAnimation}>
        <div className={styles.spinner}>
          <div className={styles.spinnerInner}>🔍</div>
        </div>
      </div>
      
      <h3 className={styles.title}>{t('Checking your moves...')}</h3>
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
