'use client'

import { useState, useEffect } from 'react'
import { Challenge, ExerciseResult } from '@/types/challenge'
import { useHero } from '@/contexts/HeroContext'
import { useGame } from '@/contexts/GameContext'
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext'
import { useConfig } from '@/contexts/ConfigContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getStarEmoji, getResultTitle, shouldCelebrate, getXpFromChallengeStars } from '@/utils/scoring'
import styles from './ResultDisplay.module.css'

interface ResultDisplayProps {
  result: ExerciseResult
  challenge: Challenge
  onClose: () => void
}

export default function ResultDisplay({ result, challenge, onClose }: ResultDisplayProps) {
  const { addCoins, addXp } = useHero()
  const { updateProgress } = useGame()
  const { addStars } = useWeeklyGoal()
  const { config } = useConfig()
  const { t } = useLanguage()
  const [coinsAnimated, setCoinsAnimated] = useState(false)
  const [displayCoins, setDisplayCoins] = useState(0)
  const [coinsAdded, setCoinsAdded] = useState(false)

  useEffect(() => {
    // Add coins, XP (from stars), update progress, and add to weekly goal (only once)
    if (!coinsAdded) {
      addCoins(result.coins)
      const challengeXp = getXpFromChallengeStars(result.stars, config.xpPerChallengeMax ?? 15)
      if (challengeXp > 0) addXp(challengeXp)
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

  const titleKey = result.stars >= 3 ? 'Amazing!' : result.stars === 2 ? 'Great job!' : 'Try again'
  const title = t(titleKey)
  const celebrate = shouldCelebrate(result.stars)

  return (
    <div className={styles.container}>
      {celebrate && (
        <div className={styles.confettiBg}>
          <div className={styles.confetti}></div>
          <div className={styles.confetti}></div>
          <div className={styles.confetti}></div>
          <div className={styles.confetti}></div>
          <div className={styles.confetti}></div>
        </div>
      )}
      <div className={`${styles.resultCard} ${celebrate ? styles.resultCardCelebrate : styles.resultCardTryAgain}`}>
        <div className={styles.celebrationIcon}>{celebrate ? '🎉' : '💪'}</div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{result.feedback}</p>

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
            <p className={styles.rewardLabel}>{t('Diamonds')}</p>
          </div>
          <div className={styles.rewardCard}>
            <span className={styles.rewardIcon}>⭐</span>
            <p className={styles.rewardAmount}>+{result.stars}</p>
            <p className={styles.rewardLabel}>{t('Stars')}</p>
          </div>
        </div>

        {/* New Record Badge - only for 3 stars */}
        {result.stars === 3 && (
          <div className={styles.recordBadge}>
            🏆 {t('NEW PERSONAL BEST!')}
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.homeButton} onClick={onClose}>
            {t('Home')}
          </button>
          <button className={styles.playAgainButton} onClick={onClose}>
            {result.stars >= 2 ? t('Play Again!') : t('Try Again')}
          </button>
        </div>
      </div>
    </div>
  )
}
