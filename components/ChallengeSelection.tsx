'use client'

import { useState } from 'react'
import { Challenge } from '@/types/challenge'
import { useGame } from '@/contexts/GameContext'
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
  const { challenges, config } = useConfig()
  const { t } = useLanguage()
  const { hasSubscription, showSubscriptionMessage } = useSubscription()
  const getMinStarsToUnlock = (challenge: Challenge) =>
    config.minStarsToUnlockByChallengeId[challenge.id] ?? challenge.unlockRequirement?.minStars ?? 2
  const [hoveredId, setHoveredId] = useState<string | null>(null)

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

  return (
    <div className={styles.container}>
      <div className={styles.trailReference}>
        {/* Golden vertical path (3D blocky strip) */}
        <div className={styles.trailPath} aria-hidden />

        <div className={styles.trailNodes}>
          {/* Top start hexagon */}
          <div className={styles.trailRow}>
            <div className={styles.sideSlot} />
            <div className={`${styles.hexNode} ${styles.hexStart}`} aria-hidden>
              <span className={styles.hexNumber}>GO</span>
            </div>
            <div className={styles.sideSlot} />
          </div>

          {sortedChallenges.map((challenge, index) => {
            const unlocked = isChallengeUnlocked(challenge, challengeProgress, getMinStarsToUnlock(challenge))
            const subscriptionLocked = challengeRequiresSubscription(index) && !hasSubscription
            const progress = getProgress(challenge.id)
            const showLock = !unlocked || subscriptionLocked
            const prevChallenge = sortedChallenges[index - 1]
            const minStars = getMinStarsToUnlock(challenge)
            const prevTitle = prevChallenge?.title ?? t('previous challenge')
            const lockReason = !unlocked
              ? `${t('Need')} ${minStars} ${minStars === 1 ? t('star') : t('stars')} ${t('on')} ${prevTitle}`
              : subscriptionLocked
                ? t('Subscribe to unlock')
                : ''
            const badgeOnLeft = index % 2 === 0

            return (
              <div key={challenge.id} className={styles.trailRow}>
                <div className={styles.sideSlot}>
                  {badgeOnLeft && (
                    <button
                      type="button"
                      className={`${styles.sideBadge} ${showLock ? styles.sideBadgeLocked : ''} ${hoveredId === challenge.id ? styles.sideBadgeHovered : ''}`}
                      onMouseEnter={() => !showLock && setHoveredId(challenge.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleChallengeClick(challenge, index)}
                      disabled={showLock}
                      aria-label={`${t('Challenges')} ${index + 1}: ${t(challenge.title)}`}
                    >
                      {progress && progress.bestStars > 0 && (
                        <span className={styles.sideBadgeStars}>★{progress.bestStars}</span>
                      )}
                      <span className={styles.sideBadgeIcon}>{showLock ? '🔒' : challenge.icon}</span>
                      <span className={styles.sideBadgeLabel}>LEVEL {index + 1}</span>
                      {showLock && (
                        <div className={styles.sideBadgeLockOverlay}>
                          <span className={styles.sideBadgeLockText}>{lockReason}</span>
                        </div>
                      )}
                    </button>
                  )}
                </div>

                <div className={styles.hexSlot}>
                  <div className={styles.hexNode}>
                    <span className={styles.hexNumber}>{index + 1}</span>
                  </div>
                </div>

                <div className={styles.sideSlot}>
                  {!badgeOnLeft && (
                    <button
                      type="button"
                      className={`${styles.sideBadge} ${showLock ? styles.sideBadgeLocked : ''} ${hoveredId === challenge.id ? styles.sideBadgeHovered : ''}`}
                      onMouseEnter={() => !showLock && setHoveredId(challenge.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleChallengeClick(challenge, index)}
                      disabled={showLock}
                      aria-label={`${t('Challenges')} ${index + 1}: ${t(challenge.title)}`}
                    >
                      {progress && progress.bestStars > 0 && (
                        <span className={styles.sideBadgeStars}>★{progress.bestStars}</span>
                      )}
                      <span className={styles.sideBadgeIcon}>{showLock ? '🔒' : challenge.icon}</span>
                      <span className={styles.sideBadgeLabel}>LEVEL {index + 1}</span>
                      {showLock && (
                        <div className={styles.sideBadgeLockOverlay}>
                          <span className={styles.sideBadgeLockText}>{lockReason}</span>
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {/* Bottom end hexagon */}
          <div className={styles.trailRow}>
            <div className={styles.sideSlot} />
            <div className={`${styles.hexNode} ${styles.hexEnd}`} aria-hidden>
              <span className={styles.hexNumber}>✓</span>
            </div>
            <div className={styles.sideSlot} />
          </div>
        </div>
      </div>
    </div>
  )
}
