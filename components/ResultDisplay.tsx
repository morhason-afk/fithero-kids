'use client'

import { useState, useEffect } from 'react'
import { Challenge, ExerciseResult } from '@/types/challenge'
import { useHero } from '@/contexts/HeroContext'
import { useGame } from '@/contexts/GameContext'
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext'
import { getStarEmoji } from '@/utils/scoring'
import styles from './ResultDisplay.module.css'

interface ResultDisplayProps {
  result: ExerciseResult
  challenge: Challenge
  onClose: () => void
}

export default function ResultDisplay({ result, challenge, onClose }: ResultDisplayProps) {
  const { addCoins } = useHero()
  const { updateProgress } = useGame()
  const { addStars } = useWeeklyGoal()
  const [coinsAnimated, setCoinsAnimated] = useState(false)
  const [displayCoins, setDisplayCoins] = useState(0)
  const [coinsAdded, setCoinsAdded] = useState(false)

  useEffect(() => {
    // Add coins to hero, update progress, and add to weekly goal (only once)
    if (!coinsAdded) {
      addCoins(result.coins)
      updateProgress(challenge.id, result.stars)
      addStars(result.stars)
      setCoinsAdded(true)
    }

    // Animate coin count
    const duration = 1000
    const steps = 20
    const increment = result.coins / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= result.coins) {
        setDisplayCoins(result.coins)
        setCoinsAnimated(true)
        clearInterval(timer)
      } else {
        setDisplayCoins(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [result.coins, addCoins, coinsAdded])

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4ade80'
    if (score >= 80) return '#22c55e'
    if (score >= 70) return '#fbbf24'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🌟'
    if (score >= 80) return '⭐'
    if (score >= 70) return '👍'
    if (score >= 60) return '👌'
    return '💪'
  }

  return (
    <div className={styles.container}>
      <div className={styles.confettiBg}>
        <div className={styles.confetti}></div>
        <div className={styles.confetti}></div>
        <div className={styles.confetti}></div>
        <div className={styles.confetti}></div>
        <div className={styles.confetti}></div>
      </div>
      <div className={styles.resultCard}>
        <div className={styles.celebrationIcon}>🎉</div>
        <h3 className={styles.title}>Amazing!</h3>
        <p className={styles.subtitle}>You completed the challenge!</p>

        {/* Stars */}
        <div className={styles.starsContainer}>
          {[1, 2, 3].map((star) => (
            <span 
              key={star} 
              className={`${styles.star} ${star <= result.stars ? styles.starActive : ''}`}
              style={{ animationDelay: `${star * 0.2}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Rewards */}
        <div className={styles.rewardsGrid}>
          <div className={styles.rewardCard}>
            <span className={styles.rewardIcon}>💎</span>
            <p className={styles.rewardAmount}>+{displayCoins}</p>
            <p className={styles.rewardLabel}>Coins</p>
          </div>
          <div className={styles.rewardCard}>
            <span className={styles.rewardIcon}>⭐</span>
            <p className={styles.rewardAmount}>+{result.stars}</p>
            <p className={styles.rewardLabel}>Stars</p>
          </div>
        </div>

        {/* New Record Badge */}
        {result.stars === 3 && (
          <div className={styles.recordBadge}>
            🏆 NEW PERSONAL BEST!
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.homeButton} onClick={onClose}>
            Home
          </button>
          <button className={styles.playAgainButton} onClick={onClose}>
            Play Again!
          </button>
        </div>
      </div>
    </div>
  )
}
