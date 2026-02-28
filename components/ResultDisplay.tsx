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

const APP_NAME = 'FitHero Kids'
const SHARE_HASHTAG = '#FitHeroKids'

interface ResultDisplayProps {
  result: ExerciseResult
  challenge: Challenge
  videoBlob?: Blob | null
  onClose: () => void
}

export default function ResultDisplay({ result, challenge, videoBlob, onClose }: ResultDisplayProps) {
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
  const hasVideo = !!videoBlob

  const getShareText = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    return `I just completed ${t(challenge.title)} in ${APP_NAME}! ⭐${result.stars} 💎+${result.coins} ${SHARE_HASHTAG}\n\n${t('Play too')}: ${url}`
  }

  const shareToWhatsApp = (text: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  const handleShareWithoutVideo = () => {
    shareToWhatsApp(getShareText())
  }

  const handleShareWithVideo = async () => {
    if (!videoBlob) {
      handleShareWithoutVideo()
      return
    }
    const text = getShareText()
    try {
      const ext = videoBlob.type.includes('mp4') ? 'mp4' : 'webm'
      const mimeType = videoBlob.type || 'video/webm'
      const file = new File([videoBlob], `fithero-challenge.${ext}`, { type: mimeType })

      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          files: [file],
          text,
          title: `${APP_NAME} – Challenge`,
        })
        return
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return
      shareToWhatsApp(text)
      return
    }
    shareToWhatsApp(text)
  }

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

        {/* Share options */}
        <div className={styles.shareRow}>
          {hasVideo ? (
            <>
              <button
                type="button"
                className={styles.shareButton}
                onClick={handleShareWithVideo}
                aria-label={t('Share with video on WhatsApp')}
              >
                📹 {t('Share with video')}
              </button>
              <button
                type="button"
                className={styles.shareButtonSecondary}
                onClick={handleShareWithoutVideo}
                aria-label={t('Share text only on WhatsApp')}
              >
                📤 {t('Share (text only)')}
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.shareButton}
              onClick={handleShareWithoutVideo}
              aria-label={t('Share on WhatsApp')}
            >
              📤 {t('Share on WhatsApp')}
            </button>
          )}
        </div>

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
