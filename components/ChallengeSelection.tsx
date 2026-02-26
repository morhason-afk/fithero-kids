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

      {/* Progress map: vertical, snake shape, empty tracks between milestones */}
      <div className={styles.progressMapVertical}>
        <div className={styles.challengePathVertical}>
          <div className={styles.startNode} aria-hidden>
            <span className={styles.startLabel}>START</span>
            <span className={styles.startFlag}>🚩</span>
          </div>
          <div className={`${styles.emptyTrack} ${styles.emptyTrackCenter}`} aria-hidden>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.emptyTrackBlock} />
            ))}
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
            const isLeft = index % 2 === 0

            return (
              <div key={challenge.id} className={styles.pathSegmentVertical}>
                {index > 0 && (
                  <div className={`${styles.diagonalConnector} ${isLeft ? styles.diagonalToLeft : styles.diagonalToRight}`} aria-hidden>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={styles.diagonalBlock} />
                    ))}
                  </div>
                )}
                <div className={`${styles.emptyTrack} ${isLeft ? styles.emptyTrackLeft : styles.emptyTrackRight}`} aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={styles.emptyTrackBlock} />
                  ))}
                </div>
                <div className={`${styles.milestoneWrap} ${isLeft ? styles.milestoneWrapLeft : styles.milestoneWrapRight}`}>
                  <button
                    type="button"
                    className={`${styles.pathNode} ${styles.milestoneNode} ${showLock ? styles.pathNodeLocked : ''} ${hoveredId === challenge.id ? styles.pathNodeHovered : ''}`}
                    onMouseEnter={() => !showLock && setHoveredId(challenge.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleChallengeClick(challenge, index)}
                    disabled={showLock}
                    aria-label={`${t('Challenges')} ${index + 1}: ${t(challenge.title)}`}
                  >
                    <span className={styles.milestoneFlag} aria-hidden>🚩</span>
                    <span className={styles.milestoneBadge}>{index + 1}</span>
                    {showLock ? (
                      <span className={styles.pathNodeIcon} aria-hidden>🔒</span>
                    ) : (
                      <span className={styles.pathNodeIcon} aria-hidden>{challenge.icon}</span>
                    )}
                    <span className={styles.pathNodeLabel}>{t(challenge.title)}</span>
                    {!showLock && progress && progress.bestStars > 0 && (
                      <span className={styles.pathNodeStars}>★{progress.bestStars}</span>
                    )}
                    {showLock && (
                      <div className={styles.pathNodeLockOverlay}>
                        <span className={styles.pathNodeLockText}>{lockReason}</span>
                        {subscriptionLocked && (
                          <button type="button" className={styles.pathNodeUnlockBtn} onClick={(e) => { e.stopPropagation(); showSubscriptionMessage('challenges'); }}>
                            {t('UNLOCK NOW')}
                          </button>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
          <div className={`${styles.emptyTrack} ${styles.emptyTrackCenter}`} aria-hidden>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.emptyTrackBlock} />
            ))}
          </div>
          <div className={styles.endNode} aria-hidden>
            <span className={styles.endFlag}>🏁</span>
            <span className={styles.endLabel}>GOAL</span>
          </div>
        </div>
      </div>
    </div>
  )
}
