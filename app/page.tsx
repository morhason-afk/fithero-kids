'use client'

import { useState } from 'react'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext'
import { HeroProvider } from '@/contexts/HeroContext'
import { GameProvider } from '@/contexts/GameContext'
import { WeeklyGoalProvider } from '@/contexts/WeeklyGoalContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import ChallengeSelection from '@/components/ChallengeSelection'
import ChallengePopup from '@/components/ChallengePopup'
import HeroSection from '@/components/HeroSection'
import WeeklyGoalDisplay from '@/components/WeeklyGoalDisplay'
import BalanceBar from '@/components/BalanceBar'
import Footer from '@/components/Footer'
import { Challenge } from '@/types/challenge'
import { useConfig } from '@/contexts/ConfigContext'
import { useGame } from '@/contexts/GameContext'
import { isChallengeUnlocked } from '@/utils/challengeProgression'
import { challengeRequiresSubscription } from '@/utils/subscription'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { useHero } from '@/contexts/HeroContext'
import styles from './page.module.css'

function HomeContent() {
  const { challenges, config } = useConfig()
  const { challengeProgress } = useGame()
  const { hasSubscription } = useSubscription()
  const { hero } = useHero()
  const { language, setLanguage, t } = useLanguage()
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showSelection, setShowSelection] = useState(true)

  const getMinStarsToUnlock = (c: Challenge) =>
    config.minStarsToUnlockByChallengeId[c.id] ?? c.unlockRequirement?.minStars ?? 2
  const sortedChallenges = [...challenges].sort((a, b) => a.order - b.order)

  const getLastUnlockedChallenge = (): Challenge | null => {
    for (let i = sortedChallenges.length - 1; i >= 0; i--) {
      const ch = sortedChallenges[i]
      const unlocked = isChallengeUnlocked(ch, challengeProgress, getMinStarsToUnlock(ch))
      const subLocked = challengeRequiresSubscription(i) && !hasSubscription
      if (unlocked && !subLocked) return ch
    }
    return null
  }

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setShowSelection(false)
  }

  const handleChallengeComplete = () => {
    setSelectedChallenge(null)
    setShowSelection(true)
  }

  const handlePlayNow = () => {
    const last = getLastUnlockedChallenge()
    if (last) {
      setSelectedChallenge(last)
      setShowSelection(false)
    } else {
      document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className={styles.main}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <div className={styles.headerRow}>
            <div className={styles.logoContainer}>
              <div className={styles.logoMark} aria-hidden>
                <svg className={styles.logoKiteSvg} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M16 2L28 12L22 28L10 18L16 2Z" fill="#E04052" />
                  <path d="M16 2L22 28M28 12L10 18" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  <path d="M14.5 23 Q16 21 18 22.5 T22 24 T24 26" stroke="#E04052" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                </svg>
                <h1 className={styles.logoWordmark}>
                  <span className={styles.logoFitHero}>{t('FitHero')}</span>
                  <span className={styles.logoKids}>{t(' Kids')}</span>
                </h1>
              </div>
              <div className={styles.logoText}>
                <p className={styles.tagline}>{t('Move • Play • Grow!')}</p>
              </div>
              <span className={styles.servedBy}>{t('by YOM Games')}</span>
            </div>
            <div className={styles.headerRight}>
              <span className={styles.levelBadge} aria-hidden>{t('LV')} {hero.stats.level}</span>
              <div className={styles.langToggle} role="group" aria-label="Language">
                <button
                  type="button"
                  className={styles.langBtn + (language === 'en' ? ' ' + styles.langBtnActive : '')}
                  onClick={() => setLanguage('en')}
                  aria-pressed={language === 'en'}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={styles.langBtn + (language === 'he' ? ' ' + styles.langBtnActive : '')}
                  onClick={() => setLanguage('he')}
                  aria-pressed={language === 'he'}
                >
                  ע
                </button>
              </div>
              <BalanceBar />
            </div>
          </div>
        </div>
      </header>

      <div className={styles.heroBox}>
        <HeroSection onPlayNow={handlePlayNow} />
      </div>

      <div className={styles.goalRow}>
        <WeeklyGoalDisplay showRewardCard={false} />
      </div>

      <div id="challenges" className={styles.contentSection}>
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
  )
}

export default function Home() {
  return (
    <ConfigProvider>
      <LanguageProvider>
        <SubscriptionProvider>
          <HeroProvider>
            <GameProvider>
              <WeeklyGoalProvider>
                <HomeContent />
              </WeeklyGoalProvider>
            </GameProvider>
          </HeroProvider>
        </SubscriptionProvider>
      </LanguageProvider>
    </ConfigProvider>
  )
}
