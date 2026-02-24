'use client'

import { useState, useEffect } from 'react'
import { Challenge } from '@/types/challenge'
import { useGame } from '@/contexts/GameContext'
import { useHero } from '@/contexts/HeroContext'
import { useConfig } from '@/contexts/ConfigContext'
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

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h2 className={styles.title}>Choose Challenge!</h2>
      </div>
      <div className={styles.challengeSubheader}>
        <p className={styles.subscriptionHint}>
          <span className={styles.hintIcon} aria-hidden>ℹ️</span>
          Challenges 1-4: Free. Challenge 5+: Requires Subscription.
        </p>
        <div className={styles.currentBalance}>
          <span className={styles.currentBalanceLabel}>CURRENT BALANCE</span>
          <span className={styles.coinIcon}>💎</span>
          <span className={styles.coinAmount} suppressHydrationWarning>{mounted ? hero.stats.totalCoins : 0}</span>
        </div>
      </div>
      
      <div className={styles.challengeGrid}>
        {sortedChallenges.map((challenge, index) => {
          const unlocked = isChallengeUnlocked(challenge, challengeProgress, getMinStarsToUnlock(challenge))
          const subscriptionLocked = challengeRequiresSubscription(index) && !hasSubscription
          const progress = getProgress(challenge.id)
          const bestStars = progress?.bestStars || 0
          const showLock = !unlocked || subscriptionLocked

          const getChallengeGradient = () => {
            if (!unlocked) return ''
            const gradients: Record<string, string> = {
              'boxing': 'linear-gradient(135deg, #FB923C 0%, #EF4444 100%)',
              'fruit-ninja': 'linear-gradient(135deg, #4ADE80 0%, #10B981 100%)',
              'jumping-jacks': 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
              'squats': 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
              'push-ups': 'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)',
              'plank': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
              'dancing': 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
              'high-knees': 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
            }
            return gradients[challenge.exerciseType] || 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)'
          }

          return (
            <div
              key={challenge.id}
              className={`${styles.challengeCard} ${
                showLock ? styles.locked : ''
              } ${hoveredId === challenge.id ? styles.hovered : ''}`}
              style={unlocked ? { background: getChallengeGradient() } : {}}
              onMouseEnter={() => unlocked && setHoveredId(challenge.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleChallengeClick(challenge, index)}
            >
              {showLock && (
                <div className={styles.lockOverlay}>
                  <div className={styles.lockIcon}>🔒</div>
                  <div className={styles.lockText}>
                    {!unlocked
                      ? `Get ${getMinStarsToUnlock(challenge)} star${getMinStarsToUnlock(challenge) !== 1 ? 's' : ''} on previous challenge to unlock`
                      : subscriptionLocked
                        ? 'Premium Challenge'
                        : ''}
                  </div>
                  {subscriptionLocked && (
                    <p className={styles.lockSubtext}>Subscribe to unlock</p>
                  )}
                  {subscriptionLocked && (
                    <button type="button" className={styles.unlockButton} onClick={(e) => { e.stopPropagation(); showSubscriptionMessage('challenges'); }}>
                      UNLOCK NOW
                    </button>
                  )}
                </div>
              )}
              {progress && bestStars > 0 && (
                <div className={styles.bestStars}>
                  ⭐ {bestStars}
                </div>
              )}
              
              {!progress && unlocked && !subscriptionLocked && (
                <div className={styles.newBadge}>NEW</div>
              )}

              <div className={styles.iconContainer}>
                <div className={styles.icon}>{challenge.icon}</div>
              </div>
              <h3 className={styles.challengeTitle}>{challenge.title}</h3>
              <div className={styles.starsDisplay}>
                {[1, 2, 3].map((star) => (
                  <span 
                    key={star} 
                    className={star <= bestStars ? styles.starFilled : styles.starEmpty}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <div className={styles.rewardDisplay}>
                <span className={styles.coinIcon}>💎</span>
                <span className={styles.rewardAmount}>+{bestStars > 0 ? bestStars * 20 : 20}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
