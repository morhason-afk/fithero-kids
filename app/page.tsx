'use client'

import { useState, useRef } from 'react'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext'
import { HeroProvider } from '@/contexts/HeroContext'
import { GameProvider } from '@/contexts/GameContext'
import { WeeklyGoalProvider } from '@/contexts/WeeklyGoalContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import ChallengeSelection from '@/components/ChallengeSelection'
import ChallengePopup from '@/components/ChallengePopup'
import HeroSection, { type HeroSectionRef } from '@/components/HeroSection'
import WeeklyGoalDisplay from '@/components/WeeklyGoalDisplay'
import BalanceBar from '@/components/BalanceBar'
import BottomNav from '@/components/BottomNav'
import SupportModal from '@/components/SupportModal'
import { Challenge } from '@/types/challenge'
import { useConfig } from '@/contexts/ConfigContext'
import { useGame } from '@/contexts/GameContext'
import { isChallengeUnlocked } from '@/utils/challengeProgression'
import { challengeRequiresSubscription } from '@/utils/subscription'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { useHero } from '@/contexts/HeroContext'
import { getXpProgress } from '@/utils/heroUtils'
import styles from './page.module.css'

function HomeContent() {
  const { challenges, config } = useConfig()
  const { challengeProgress } = useGame()
  const { hasSubscription } = useSubscription()
  const { hero } = useHero()
  const { language, setLanguage, t } = useLanguage()
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showSelection, setShowSelection] = useState(true)
  const [showSupport, setShowSupport] = useState(false)
  const supportEmail = config.supportEmail?.trim() || 'support@example.com'

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

  const heroSectionRef = useRef<HeroSectionRef>(null)
  const experiencePerLevel = typeof config.experiencePerLevel === 'number' && config.experiencePerLevel >= 1 ? config.experiencePerLevel : 20
  const heroStats = hero?.stats
  const { xpInLevel, xpNeeded } = getXpProgress(heroStats?.experience ?? 0, experiencePerLevel)
  const xpPercent = xpNeeded > 0 ? Math.round((xpInLevel / xpNeeded) * 100) : 0
  const heroLevel = heroStats?.level ?? 1

  const handlePlayNow = () => {
    const last = getLastUnlockedChallenge()
    if (last) {
      setSelectedChallenge(last)
      setShowSelection(false)
    } else {
      document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToChallenges = () => {
    document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToMore = () => {
    document.getElementById('weekly-goal')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className={styles.main}>
      <div className={styles.skyWrap}>
        <div className={styles.sceneLayer} aria-hidden>
          {/* Blocky clouds (rectangles) */}
          <div className={styles.clouds}>
            <div className={`${styles.blockyCloud} ${styles.blockyCloud1}`}>
              {[1,2,3,4,5,6].map((i) => <div key={i} className={styles.cloudBlock} />)}
            </div>
            <div className={`${styles.blockyCloud} ${styles.blockyCloud2}`}>
              {[1,2,3,4,5].map((i) => <div key={i} className={styles.cloudBlock} />)}
            </div>
            <div className={`${styles.blockyCloud} ${styles.blockyCloud3}`}>
              {[1,2,3,4,5,6,7].map((i) => <div key={i} className={styles.cloudBlock} />)}
            </div>
            <div className={`${styles.blockyCloud} ${styles.blockyCloud4}`}>
              {[1,2,3,4,5].map((i) => <div key={i} className={styles.cloudBlock} />)}
            </div>
            <div className={`${styles.blockyCloud} ${styles.blockyCloud5}`}>
              {[1,2,3,4,5,6].map((i) => <div key={i} className={styles.cloudBlock} />)}
            </div>
            <div className={`${styles.blockyCloud} ${styles.blockyCloud6}`}>
              {[1,2,3,4].map((i) => <div key={i} className={styles.cloudBlock} />)}
            </div>
            <div className={`${styles.blockyCloud} ${styles.blockyCloud7}`}>
              {[1,2,3,4,5].map((i) => <div key={i} className={styles.cloudBlock} />)}
            </div>
            <div className={`${styles.blockyCloud} ${styles.blockyCloud8}`}>
              {[1,2,3,4,5,6].map((i) => <div key={i} className={styles.cloudBlock} />)}
            </div>
          </div>
          {/* Blocky trees */}
          <div className={styles.trees}>
            <div className={`${styles.blockyTree} ${styles.blockyTree1}`}>
              <div className={styles.treeLeaves}>
                {[1,2,3,4,5,6].map((i) => <div key={i} className={styles.treeLeafBlock} />)}
              </div>
              <div className={styles.treeTrunk} />
            </div>
            <div className={`${styles.blockyTree} ${styles.blockyTree2}`}>
              <div className={styles.treeLeaves}>
                {[1,2,3,4,5].map((i) => <div key={i} className={styles.treeLeafBlock} />)}
              </div>
              <div className={styles.treeTrunk} />
            </div>
            <div className={`${styles.blockyTree} ${styles.blockyTree3}`}>
              <div className={styles.treeLeaves}>
                {[1,2,3,4,5,6].map((i) => <div key={i} className={styles.treeLeafBlock} />)}
              </div>
              <div className={styles.treeTrunk} />
            </div>
            <div className={`${styles.blockyTree} ${styles.blockyTree4}`}>
              <div className={styles.treeLeaves}>
                {[1,2,3,4,5].map((i) => <div key={i} className={styles.treeLeafBlock} />)}
              </div>
              <div className={styles.treeTrunk} />
            </div>
            <div className={`${styles.blockyTree} ${styles.blockyTree5}`}>
              <div className={styles.treeLeaves}>
                {[1,2,3,4,5].map((i) => <div key={i} className={styles.treeLeafBlock} />)}
              </div>
              <div className={styles.treeTrunk} />
            </div>
            <div className={`${styles.blockyTree} ${styles.blockyTree6}`}>
              <div className={styles.treeLeaves}>
                {[1,2,3,4].map((i) => <div key={i} className={styles.treeLeafBlock} />)}
              </div>
              <div className={styles.treeTrunk} />
            </div>
          </div>
          {/* Blocky ground strip */}
          <div className={styles.blockyGround}>
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className={i % 4 === 0 ? `${styles.groundBlock} ${styles.groundBlockGrass}` : `${styles.groundBlock} ${styles.groundBlockDirt}`}
              />
            ))}
          </div>
        </div>

        <header className={styles.pageHeader}>
          <div className={styles.headerInner}>
            <div className={styles.headerRow}>
              <div className={styles.headerAvatar} aria-hidden>
                <span className={styles.headerAvatarEmoji}>🧒</span>
              </div>
              <div className={styles.headerLevelBlock}>
                <span className={styles.headerLevelText}>{t('Level')} {heroLevel}</span>
                <div className={styles.headerLevelBar} role="progressbar" aria-valuenow={xpInLevel} aria-valuemin={0} aria-valuemax={xpNeeded}>
                  <div className={styles.headerLevelBarFill} style={{ width: `${xpPercent}%` }} />
                </div>
              </div>
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
                <div className={styles.langToggle} role="group" aria-label="Language">
                  <button
                    type="button"
                    className={styles.langBtn + (language === 'en' ? ' ' + styles.langBtnActive : '')}
                    onClick={() => setLanguage('en')}
                    aria-pressed={language === 'en'}
                    title="English"
                  >
                    🇺🇸
                  </button>
                  <button
                    type="button"
                    className={styles.langBtn + (language === 'he' ? ' ' + styles.langBtnActive : '')}
                    onClick={() => setLanguage('he')}
                    aria-pressed={language === 'he'}
                    title="עברית"
                  >
                    🇮🇱
                  </button>
                </div>
                <BalanceBar />
              </div>
            </div>
          </div>
        </header>

        <div className={styles.contentWrap}>
          <div className={styles.heroBox}>
            <HeroSection ref={heroSectionRef} onPlayNow={handlePlayNow} />
          </div>

          <div id="weekly-goal" className={styles.goalRow}>
            <WeeklyGoalDisplay showRewardCard={false} />
          </div>

          <div id="challenges" className={styles.challengesSection}>
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
        </div>
      </div>

      <div className={styles.bottomNavWrap}>
        <BottomNav
          onPlay={handlePlayNow}
          onCharacter={() => heroSectionRef.current?.openCustomizer()}
          onChallenges={scrollToChallenges}
          onContactSupport={() => setShowSupport(true)}
          onMore={scrollToMore}
        />
      </div>

      {showSupport && (
        <SupportModal supportEmail={supportEmail} onClose={() => setShowSupport(false)} />
      )}
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
