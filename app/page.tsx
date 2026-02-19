'use client'

import { useState } from 'react'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { HeroProvider } from '@/contexts/HeroContext'
import { GameProvider } from '@/contexts/GameContext'
import { WeeklyGoalProvider } from '@/contexts/WeeklyGoalContext'
import ChallengeSelection from '@/components/ChallengeSelection'
import ChallengePopup from '@/components/ChallengePopup'
import HeroSection from '@/components/HeroSection'
import WeeklyGoalDisplay from '@/components/WeeklyGoalDisplay'
import { Challenge } from '@/types/challenge'
import styles from './page.module.css'

export default function Home() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showSelection, setShowSelection] = useState(true)

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setShowSelection(false)
  }

  const handleChallengeComplete = () => {
    setSelectedChallenge(null)
    setShowSelection(true)
  }

  return (
    <ConfigProvider>
      <HeroProvider>
        <GameProvider>
          <WeeklyGoalProvider>
          <main className={styles.main}>
        <header className={styles.pageHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <svg viewBox="0 0 100 100" className={styles.logoSvg}>
                <circle cx="50" cy="35" r="18" fill="#FDCB6E" />
                <path d="M50 55 L30 90 L50 80 L70 90 Z" fill="#00CEC9" />
                <circle cx="45" cy="32" r="3" fill="#2D3436" />
                <circle cx="55" cy="32" r="3" fill="#2D3436" />
                <path d="M45 40 Q50 45 55 40" stroke="#E74C3C" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M25 50 L15 65" stroke="#FDCB6E" strokeWidth="6" strokeLinecap="round" />
                <path d="M75 50 L85 35" stroke="#FDCB6E" strokeWidth="6" strokeLinecap="round" />
              </svg>
              <div className={styles.starBadge}>⭐</div>
            </div>
            <h1 className={styles.appTitle}>FitHero Kids</h1>
            <p className={styles.tagline}>Move • Play • Grow!</p>
          </div>
        </header>

        {/* Weekly Goal Display */}
        <WeeklyGoalDisplay />

        {/* Hero area */}
        <div className={styles.heroBox}>
          <HeroSection />
        </div>
        
        {/* Challenges section */}
        <div className={styles.contentSection}>
          {showSelection && (
            <ChallengeSelection onSelectChallenge={handleChallengeSelect} />
          )}
          {selectedChallenge && (
            <ChallengePopup
              challenge={selectedChallenge}
              onComplete={handleChallengeComplete}
            />
          )}
        </div>
      </main>
          </WeeklyGoalProvider>
        </GameProvider>
      </HeroProvider>
    </ConfigProvider>
  )
}
