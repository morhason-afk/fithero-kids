'use client'

import { useState } from 'react'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { HeroProvider } from '@/contexts/HeroContext'
import { GameProvider } from '@/contexts/GameContext'
import { WeeklyGoalProvider } from '@/contexts/WeeklyGoalContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import ChallengeSelection from '@/components/ChallengeSelection'
import ChallengePopup from '@/components/ChallengePopup'
import HeroSection from '@/components/HeroSection'
import FaceIcon from '@/components/FaceIcon'
import WeeklyGoalDisplay from '@/components/WeeklyGoalDisplay'
import BalanceBar from '@/components/BalanceBar'
import Footer from '@/components/Footer'
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
      <SubscriptionProvider>
        <HeroProvider>
          <GameProvider>
            <WeeklyGoalProvider>
          <main className={styles.main}>
        <header className={styles.pageHeader}>
          <div className={styles.headerRow}>
            <div className={styles.logoContainer}>
              <span className={styles.logoIcon} aria-hidden>⚡</span>
              <div>
                <h1 className={styles.appTitle}>FitHero Kids</h1>
                <p className={styles.tagline}>Move • Play • Grow!</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <BalanceBar />
              <div className={styles.headerFace}>
                <FaceIcon />
              </div>
            </div>
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
        <Footer />
      </main>
            </WeeklyGoalProvider>
          </GameProvider>
        </HeroProvider>
      </SubscriptionProvider>
    </ConfigProvider>
  )
}
