'use client'

import { useState, useEffect } from 'react'
import { Challenge } from '@/types/challenge'
import { useGame } from '@/contexts/GameContext'
import { useHero } from '@/contexts/HeroContext'
import { useConfig } from '@/contexts/ConfigContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { isChallengeUnlocked } from '@/utils/challengeProgression'
import { challengeRequiresSubscription } from '@/utils/subscription'
import styles from './ChallengeSelection.module.css'

interface ChallengeSelectionProps {
  onSelectChallenge: (challenge: Challenge) => void
}

export default function ChallengeSelection({ onSelectChallenge }: ChallengeSelectionProps) {
  const { challengeProgress, getProgress } = useGame()
  const { hero } = useHero()
  const { challenges, config } = useConfig()
  const { t } = useLanguage()
  const { hasSubscription, showSubscriptionMessage } = useSubscription()
  const getMinStarsToUnlock = (challenge: Challenge) =>
    config.minStarsToUnlockByChallengeId[challenge.id] ?? challenge.unlockRequirement?.minStars ?? 2
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const sortedChallenges = [...challenges].sort((a, b) => a.order - b.order)

  const handleChallengeClick = (challenge: Challenge, index: number) => {
    const unlocked = isChallengeUnlocked(challenge, challengeProgress, getMinStarsToUnlock(challenge))
    if (!unlocked) return
    const needsSubscription = challengeRequiresSubscription(index) && !hasSubscription
    if (needsSubscription) {
      showSubscriptionMessage('challenges')
      return
    }
    onSelectChallenge(challenge)
  }

  const getRewardRange = (ch: Challenge) => {
    const min = 15 + ch.duration * 2
    const max = 40 + ch.duration * 3
    return { min, max }
  }

  const isPopular = (idx: number) => idx === 3

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h2 className={styles.title}>{t('Challenges')}</h2>
        <div className={styles.titleLine} aria-hidden />
        <span className={styles.titleMeta} suppressHydrationWarning>
          {mounted ? sortedChallenges.filter((c, i) => isChallengeUnlocked(c, challengeProgress, getMinStarsToUnlock(c)) && !(challengeRequiresSubscription(i) && !hasSubscription)).length : 0} {t('available')}
        </span>
      </div>
      
      <div className={styles.challengeGrid}>
        {sortedChallenges.map((challenge, index) => {
          const unlocked = isChallengeUnlocked(challenge, challengeProgress, getMinStarsToUnlock(challenge))
          const subscriptionLocked = challengeRequiresSubscription(index) && !hasSubscription
          const progress = getProgress(challenge.id)
          const bestStars = progress?.bestStars || 0
          const showLock = !unlocked || subscriptionLocked
          const { min: rewardMin, max: rewardMax } = getRewardRange(challenge)
          const prevChallenge = sortedChallenges[index - 1]
          const minStars = getMinStarsToUnlock(challenge)
          const prevTitle = prevChallenge?.title ?? t('previous challenge')
          const lockReason = !unlocked
            ? `${t('Need')} ${minStars} ${minStars === 1 ? t('star') : t('stars')} ${t('on')} ${prevTitle}`
            : subscriptionLocked
              ? t('Subscribe to unlock')
              : ''

          return (
            <div
              key={challenge.id}
              className={`${styles.challengeCard} ${
                showLock ? styles.locked : ''
              } ${hoveredId === challenge.id ? styles.hovered : ''}`}
              onMouseEnter={() => unlocked && setHoveredId(challenge.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleChallengeClick(challenge, index)}
            >
              {showLock && (
                <div className={styles.lockOverlay}>
                  <div className={styles.lockIcon}>🔒</div>
                  <div className={styles.lockText}>{lockReason}</div>
                  {subscriptionLocked && (
                    <button type="button" className={styles.unlockButton} onClick={(e) => { e.stopPropagation(); showSubscriptionMessage('challenges'); }}>
                      {t('UNLOCK NOW')}
                    </button>
                  )}
                </div>
              )}
              {!progress && unlocked && !subscriptionLocked && index !== 3 && (
                <div className={styles.tagNew}>{t('New')}</div>
              )}
              {unlocked && !subscriptionLocked && isPopular(index) && (
                <div className={styles.tagPopular}>{t('Popular')}</div>
              )}

              <div className={styles.cardRow}>
                <div className={styles.iconLeft}>
                  {showLock ? <span className={styles.lockEmoji} aria-hidden>🔒</span> : <span className={styles.icon}>{challenge.icon}</span>}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.challengeTitle}>{t(challenge.title)}</h3>
                  <p className={styles.challengeDesc}>{t(challenge.description)}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.duration}>{challenge.duration} {t('sec')}</span>
                    {!showLock && (
                      <span className={styles.rewardRange}>
                        <span className={styles.diamond} aria-hidden>💎</span>
                        {rewardMin}-{rewardMax}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
