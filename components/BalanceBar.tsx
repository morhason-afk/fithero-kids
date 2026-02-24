'use client'

import { useState, useEffect } from 'react'
import { useHero } from '@/contexts/HeroContext'
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext'
import styles from './BalanceBar.module.css'

export default function BalanceBar() {
  const { hero } = useHero()
  const { progress } = useWeeklyGoal()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={styles.balanceBar}>
      <div className={styles.diamonds}>
        <span className={styles.icon}>💎</span>
        <span className={styles.amount} suppressHydrationWarning>
          {mounted ? hero.stats.totalCoins : 0}
        </span>
        <span className={styles.label}>Diamonds</span>
      </div>
      <div className={styles.stars}>
        <span className={styles.icon}>⭐</span>
        <span className={styles.amount} suppressHydrationWarning>
          {mounted ? progress.starsEarned : 0}
        </span>
        <span className={styles.label}>Stars</span>
      </div>
    </div>
  )
}
