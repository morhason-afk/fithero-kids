'use client'

import { useState, useEffect } from 'react'
import { useHero } from '@/contexts/HeroContext'
import HeroCharacter from './HeroCharacter'
import HeroCustomizer from './HeroCustomizer'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  const { hero } = useHero()
  const { stats } = hero
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering dynamic values after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={styles.heroSection}>
      {/* Hero Character Card */}
      <HeroCharacter />
      
      {/* Stats Cards */}
      <div className={styles.statsColumn}>
        {/* Energy Bar */}
        <div className={styles.statCard} style={{ background: 'linear-gradient(to right, #4ADE80, #10B981)' }}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>⚡</span>
            <span className={styles.statName}>Energy</span>
            <span className={styles.statValue} suppressHydrationWarning>{mounted ? stats.health : 0}/100</span>
          </div>
          <div className={styles.statBar}>
            <div className={styles.statBarFill} style={{ width: `${mounted ? stats.health : 0}%` }}></div>
          </div>
        </div>

        {/* Strength Bar */}
        <div className={styles.statCard} style={{ background: 'linear-gradient(to right, #F87171, #EF4444)' }}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>💪</span>
            <span className={styles.statName}>Strength</span>
            <span className={styles.statValue} suppressHydrationWarning>{mounted ? stats.strength : 0}/100</span>
          </div>
          <div className={styles.statBar}>
            <div className={styles.statBarFill} style={{ width: `${mounted ? stats.strength : 0}%` }}></div>
          </div>
        </div>

        {/* Speed Bar */}
        <div className={styles.statCard} style={{ background: 'linear-gradient(to right, #60A5FA, #3B82F6)' }}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>🏃</span>
            <span className={styles.statName}>Speed</span>
            <span className={styles.statValue} suppressHydrationWarning>{mounted ? Math.min(100, stats.level * 7) : 0}/100</span>
          </div>
          <div className={styles.statBar}>
            <div className={styles.statBarFill} style={{ width: `${mounted ? Math.min(100, stats.level * 7) : 0}%` }}></div>
          </div>
        </div>

        {/* Currency Display */}
        <div className={styles.currencyRow}>
          <div className={styles.currencyCard} style={{ background: 'linear-gradient(to right, #FBBF24, #F59E0B)' }}>
            <span className={styles.currencyIcon}>💎</span>
            <p className={styles.currencyAmount} suppressHydrationWarning>{mounted ? stats.totalCoins : 0}</p>
            <p className={styles.currencyLabel}>Coins</p>
          </div>
          <div className={styles.currencyCard} style={{ background: 'linear-gradient(to right, #A78BFA, #8B5CF6)' }}>
            <span className={styles.currencyIcon}>⭐</span>
            <p className={styles.currencyAmount} suppressHydrationWarning>0</p>
            <p className={styles.currencyLabel}>Stars</p>
          </div>
        </div>
      </div>
      
      {/* Hero Customizer */}
      <HeroCustomizer />
    </div>
  )
}
