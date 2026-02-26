'use client'

import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import HeroCharacter from './HeroCharacter'
import HeroCustomizer, { type CustomizerSection } from './HeroCustomizer'
import HeroNameEditor, { getStoredHeroName } from './HeroNameEditor'
import styles from './HeroBlock.module.css'

export interface HeroBlockRef {
  openCustomizer: () => void
  shareContainerRef: React.RefObject<HTMLDivElement | null>
}

const HeroBlock = forwardRef<HeroBlockRef>(function HeroBlock(_, ref) {
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
    shareContainerRef,
  }), [shareContainerRef])

  return (
    <>
      <div className={styles.block}>
        <div ref={shareContainerRef} className={styles.characterCircle}>
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

export default HeroBlock
