'use client'

import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import HeroCharacter from './HeroCharacter'
import HeroCustomizer, { type CustomizerSection } from './HeroCustomizer'
import HeroNameEditor, { getStoredHeroName } from './HeroNameEditor'
import styles from './HeroBlock.module.css'

export interface HeroBlockRef {
  openCustomizer: () => void
  openNameEditor: () => void
  shareContainerRef: React.RefObject<HTMLDivElement | null>
}

interface HeroBlockProps {
  /** When false, character is hidden from main screen (only accessible via bottom menu) */
  showOnMainScreen?: boolean
}

const HeroBlock = forwardRef<HeroBlockRef, HeroBlockProps>(function HeroBlock({ showOnMainScreen = false }, ref) {
  const { t } = useLanguage()
  const shareContainerRef = useRef<HTMLDivElement>(null)
  const [customizerOpen, setCustomizerOpen] = useState(false)
  const [customizerSection, setCustomizerSection] = useState<CustomizerSection>('character')
  const [heroName, setHeroName] = useState('FitHero')
  const [nameEditorOpen, setNameEditorOpen] = useState(false)

  useEffect(() => {
    setHeroName(getStoredHeroName())
  }, [])

  const openCharacterCustomizer = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCustomizerSection('character')
    setCustomizerOpen(true)
  }

  useImperativeHandle(ref, () => ({
    openCustomizer: () => openCharacterCustomizer(),
    openNameEditor: () => setNameEditorOpen(true),
    shareContainerRef,
  }), [shareContainerRef])

  return (
    <>
      {showOnMainScreen ? (
        <div className={styles.block}>
          <div
            ref={shareContainerRef}
            className={styles.characterCircle}
            onClick={openCharacterCustomizer}
            onKeyDown={(e) => e.key === 'Enter' && openCharacterCustomizer()}
            role="button"
            tabIndex={0}
            aria-label={t('Customize hero')}
          >
            <HeroCharacter />
          </div>
          <div className={styles.namePlate}>
            <span>{heroName}</span>
            <button
              type="button"
              className={styles.nameEditBtn}
              onClick={() => setNameEditorOpen(true)}
              aria-label={t('Edit hero name')}
            >
              ✏️
            </button>
          </div>
        </div>
      ) : (
        <div
          ref={shareContainerRef}
          className={styles.shareCaptureOnly}
          aria-hidden
        >
          <HeroCharacter />
        </div>
      )}
      <HeroCustomizer
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        initialSection={customizerSection}
        onEditName={() => setNameEditorOpen(true)}
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

export default HeroBlock
