'use client'

import { useState } from 'react'
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext'
import WeeklyGoalSettings from './WeeklyGoalSettings'
import styles from './WeeklyGoalDisplay.module.css'

export default function WeeklyGoalDisplay() {
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
        {/* Goal Card */}
        <div className={styles.goalCard}>
          <div className={styles.goalCardBg}></div>
          <div className={styles.goalCardContent}>
            <div className={styles.goalHeader}>
              <div>
                <p className={styles.goalLabel}>THIS WEEK'S GOAL</p>
                <h3 className={styles.goalTitle}>
                  Complete {goal.starsRequired} Challenges!
                </h3>
              </div>
              <div className={styles.goalHeaderRight}>
                <button 
                  className={styles.editButton}
                  onClick={() => setShowSettings(true)}
                  aria-label="Edit weekly goal"
                >
                  ⚙️
                </button>
                <div className={styles.goalIcon}>
                  <span>🎯</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span>Progress</span>
                <span className={styles.progressCount}>
                  {progress.starsEarned}/{goal.starsRequired} Complete
                </span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Days Remaining */}
            <div className={styles.daysRemaining}>
              <span className={styles.clockIcon}>⏰</span>
              <span>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining</span>
            </div>
          </div>
        </div>

        {/* Reward Preview Card */}
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
      </div>

      {showSettings && (
        <WeeklyGoalSettings onClose={() => setShowSettings(false)} />
      )}
    </>
  )
}
