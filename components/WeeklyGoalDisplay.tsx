'use client'

import { useState } from 'react'
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext'
import WeeklyGoalSettings from './WeeklyGoalSettings'
import styles from './WeeklyGoalDisplay.module.css'

interface WeeklyGoalDisplayProps {
  /** When true (default), show reward card. Set false on main page to match v0 two-card row. */
  showRewardCard?: boolean
}

export default function WeeklyGoalDisplay({ showRewardCard = true }: WeeklyGoalDisplayProps) {
  const { goal, progress } = useWeeklyGoal()
  const [showSettings, setShowSettings] = useState(false)
  
  const progressPercent = Math.min(100, (progress.starsEarned / goal.starsRequired) * 100)

  const getDaysRemaining = () => {
    if (!progress) return 7
    const nextMonday = progress.weekStartDate + (7 * 24 * 60 * 60 * 1000)
    const days = Math.ceil((nextMonday - Date.now()) / (1000 * 60 * 60 * 24))
    return Math.max(0, Math.min(7, days))
  }
  
  const daysRemaining = getDaysRemaining()

  return (
    <>
      <div className={styles.goalContainer}>
        {/* Goal Card - v0 style */}
        <div className={styles.goalCard}>
          <div className={styles.goalCardBg}></div>
          <div className={styles.goalCardContent}>
            <div className={styles.goalHeader}>
              <h3 className={styles.goalTitle}>Weekly Goal</h3>
              <button 
                className={styles.editButton}
                onClick={() => setShowSettings(true)}
                aria-label="Edit goal"
              >
                <span className={styles.settingsIcon} aria-hidden>⚙️</span>
              </button>
            </div>
            <div className={styles.progressText}>
              <span className={styles.progressCount}>
                {progress.starsEarned} / {goal.starsRequired}
              </span>
              <span className={styles.starIcon} aria-hidden>⭐</span>
              <span className={styles.thisWeek}>this week</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className={styles.goalTreat}>Goal: {goal.starsRequired} stars for a special treat!</p>
          </div>
        </div>

        {/* Reward Preview Card - hidden when showRewardCard is false */}
        {showRewardCard && (
        <div className={styles.rewardCard}>
          <div className={styles.rewardBg}>🏆</div>
          <span className={styles.rewardCrown} aria-hidden>👑</span>
          <div className={styles.rewardContent}>
            <p className={styles.rewardLabel}>WEEKLY REWARD</p>
            <h3 className={styles.rewardTitle}>{goal.giftDescription}!</h3>
            <div className={styles.rewardPreview}>
              <div className={styles.rewardIcon}>
                <span>👑</span>
              </div>
              <div className={styles.rewardStats}>
                <p className={styles.rewardValue}>+500 Diamonds</p>
                <p className={styles.rewardValue}>+50 Stars</p>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {showSettings && (
        <WeeklyGoalSettings onClose={() => setShowSettings(false)} />
      )}
    </>
  )
}
