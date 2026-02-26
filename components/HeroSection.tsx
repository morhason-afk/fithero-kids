'use client'

import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useHero } from '@/contexts/HeroContext'
import { useConfig } from '@/contexts/ConfigContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getXpProgress } from '@/utils/heroUtils'
import HeroCharacter from './HeroCharacter'
import HeroCustomizer, { type CustomizerSection } from './HeroCustomizer'
import HeroNameEditor, { getStoredHeroName } from './HeroNameEditor'
import ShareButton from './ShareButton'
import styles from './HeroSection.module.css'

export interface HeroSectionRef {
  openCustomizer: () => void
}

interface HeroSectionProps {
  onPlayNow?: () => void
}

const HeroSection = forwardRef<HeroSectionRef, HeroSectionProps>(function HeroSection({ onPlayNow }, ref) {
  const { hero } = useHero()
  const { config } = useConfig()
  const { t } = useLanguage()
  const experiencePerLevel = typeof config.experiencePerLevel === 'number' && config.experiencePerLevel >= 1 ? config.experiencePerLevel : 20
  const { xpInLevel, xpNeeded } = getXpProgress(hero.stats.experience, experiencePerLevel)
  const xpPercent = xpNeeded > 0 ? Math.round((xpInLevel / xpNeeded) * 100) : 0
  const shareContainerRef = useRef<HTMLDivElement>(null)
  const [customizerOpen, setCustomizerOpen] = useState(false)
  const [customizerSection, setCustomizerSection] = useState<CustomizerSection>('character')
  const [heroName, setHeroName] = useState('FitHero')
  const [nameEditorOpen, setNameEditorOpen] = useState(false)

  useEffect(() => {
    setHeroName(getStoredHeroName())
  }, [])

  const handlePlayNow = () => {
    if (onPlayNow) onPlayNow()
    else document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' })
  }

  const openCharacterCustomizer = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCustomizerSection('character')
    setCustomizerOpen(true)
  }

  useImperativeHandle(ref, () => ({
    openCustomizer: () => openCharacterCustomizer(),
  }), [])

  return (
    <>
    <section className={styles.heroWrapper}>
      <div className={styles.noiseBg} aria-hidden />
      <div className={styles.heroGlow} aria-hidden />
      <div className={styles.heroInner}>
        <div className={styles.heroCharacterArea}>
          <div className={styles.energyRing} aria-hidden />
          <div className={`${styles.energyRing} ${styles.energyRing2}`} aria-hidden />
          <div ref={shareContainerRef} className={styles.heroCharacterCircle}>
            <HeroCharacter />
          </div>
          <div className={styles.heroGroundShadow} aria-hidden />
          <div className={styles.heroNamePlate}>
            <span aria-hidden>🛡️</span>
            <span>{heroName}</span>
            <button
              type="button"
              className={styles.heroNameEditBtn}
              onClick={() => setNameEditorOpen(true)}
              aria-label={t('Edit hero name')}
            >
              <span aria-hidden>✏️</span>
            </button>
          </div>
        </div>
        <div className={styles.heroCopy}>
          <div className={styles.heroBadges}>
            <span className={styles.badgeLevel}>{t('Level')} {hero.stats.level}</span>
            <span className={styles.badgeFitHero}>{t('FitHero')}</span>
          </div>
          <h2 className={styles.heroHeadline}>{t('Ready to Move?')}</h2>
          <p className={styles.heroSubline}>{t('Complete challenges, earn diamonds, and become the ultimate FitHero!')}</p>
          <div className={styles.heroXpBar}>
            <div className={styles.heroXpLabel}>
              <span>{t('XP Progress')}</span>
              <span>{xpInLevel} / {xpNeeded}</span>
            </div>
            <div className={styles.heroXpTrack}>
              <div className={styles.heroXpFill} style={{ width: `${xpPercent}%`, background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 50%, var(--accent) 100%)', boxShadow: '0 0 12px rgba(255, 107, 53, 0.5)' }} role="progressbar" aria-valuenow={xpInLevel} aria-valuemin={0} aria-valuemax={xpNeeded} />
            </div>
          </div>
          <div className={styles.heroCtaRow}>
            <button type="button" className={styles.playNowButton} onClick={handlePlayNow}>
              {t('✨ Play Now')}
            </button>
            <button type="button" className={styles.customizeCharacterButton} onClick={(e) => openCharacterCustomizer(e)}>
              {t('Customize')}
            </button>
            <ShareButton shareContainerRef={shareContainerRef} />
          </div>
        </div>
      </div>
    </section>
      <HeroCustomizer
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        initialSection={customizerSection}
      />
      <HeroNameEditor
        isOpen={nameEditorOpen}
        onClose={() => setNameEditorOpen(false)}
        currentName={heroName}
        onSave={setHeroName}
      />
    </>
  )
})

export default HeroSection
