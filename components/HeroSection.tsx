'use client'

import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useHero } from '@/contexts/HeroContext'
import { useLanguage } from '@/contexts/LanguageContext'
import HeroCharacter from './HeroCharacter'
import HeroCustomizer, { type CustomizerSection } from './HeroCustomizer'
import HeroNameEditor, { getStoredHeroName } from './HeroNameEditor'
import styles from './HeroSection.module.css'

export interface HeroSectionRef {
  openCustomizer: () => void
  shareContainerRef: React.RefObject<HTMLDivElement | null>
}

interface HeroSectionProps {
  onPlayNow?: () => void
}

const HeroSection = forwardRef<HeroSectionRef, HeroSectionProps>(function HeroSection({ onPlayNow }, ref) {
  const { hero } = useHero()
  const { t } = useLanguage()
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
    shareContainerRef,
  }), [shareContainerRef])

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
            <span className={styles.badgeFitHero}>{t('FitHero')}</span>
          </div>
          <h2 className={styles.heroHeadline}>{t('Ready to Move?')}</h2>
          <p className={styles.heroSubline}>{t('Complete challenges, earn diamonds, and become the ultimate FitHero!')}</p>
          <div className={styles.heroCtaRow}>
            <button type="button" className={styles.playNowButton} onClick={handlePlayNow}>
              {t('✨ Play Now')}
            </button>
            <button type="button" className={styles.customizeCharacterButton} onClick={(e) => openCharacterCustomizer(e)}>
              {t('Customize')}
            </button>
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
