'use client'

import { useState } from 'react'
import { Challenge } from '@/types/challenge'
import { useGame } from '@/contexts/GameContext'
import { useHero } from '@/contexts/HeroContext'
import { useConfig } from '@/contexts/ConfigContext'
import { isChallengeUnlocked } from '@/utils/challengeProgression'
import { getStarEmoji } from '@/utils/scoring'
import styles from './ChallengeSelection.module.css'

interface ChallengeSelectionProps {
  onSelectChallenge: (challenge: Challenge) => void
}

export default function ChallengeSelection({ onSelectChallenge }: ChallengeSelectionProps) {
  const { challengeProgress, getProgress } = useGame()
  const { hero } = useHero()
  const { challenges } = useConfig()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const sortedChallenges = [...challenges].sort((a, b) => a.order - b.order)

  const handleChallengeClick = (challenge: Challenge) => {
    if (isChallengeUnlocked(challenge, challengeProgress)) {
      onSelectChallenge(challenge)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h2 className={styles.title}>Choose Challenge!</h2>
        <div className={styles.coinBalance}>
          <span className={styles.coinIcon}>💎</span>
          <span className={styles.coinAmount}>{hero.stats.totalCoins}</span>
        </div>
      </div>
      
      <div className={styles.challengeGrid}>
        {sortedChallenges.map((challenge) => {
          const unlocked = isChallengeUnlocked(challenge, challengeProgress)
          const progress = getProgress(challenge.id)
          const bestStars = progress?.bestStars || 0

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
                !unlocked ? styles.locked : ''
              } ${hoveredId === challenge.id ? styles.hovered : ''}`}
              style={unlocked ? { background: getChallengeGradient() } : {}}
              onMouseEnter={() => unlocked && setHoveredId(challenge.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleChallengeClick(challenge)}
            >
              {!unlocked && (
                <div className={styles.lockOverlay}>
                  <div className={styles.lockIcon}>🔒</div>
                  <div className={styles.lockText}>
                    Get {challenge.unlockRequirement?.minStars || 2} stars on previous challenge to unlock
                  </div>
                </div>
              )}
              
              {progress && bestStars > 0 && (
                <div className={styles.bestStars}>
                  ⭐ {bestStars}
                </div>
              )}
              
              {!progress && unlocked && (
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
