'use client'

import { useRef, useState } from 'react'
import HeroCharacter from './HeroCharacter'
import HeroCustomizer, { type CustomizerSection } from './HeroCustomizer'
import FaceIcon from './FaceIcon'
import ShareButton from './ShareButton'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  const shareContainerRef = useRef<HTMLDivElement>(null)
  const [customizerOpen, setCustomizerOpen] = useState(false)
  const [customizerSection, setCustomizerSection] = useState<CustomizerSection>('character')

  const openCharacterCustomizer = () => {
    setCustomizerSection('character')
    setCustomizerOpen(true)
  }
  const openFaceCustomizer = () => {
    setCustomizerSection('face')
    setCustomizerOpen(true)
  }

  return (
    <div className={styles.heroSection}>
      <div ref={shareContainerRef} className={styles.heroBlocks}>
        <div className={styles.heroCharacterBlock}>
          <HeroCharacter />
          <button type="button" className={styles.customizeCharacterButton} onClick={openCharacterCustomizer}>
            🦸 Customize Character
          </button>
        </div>
        <div className={styles.heroFaceBlock}>
          <p className={styles.faceBlockLabel}>HERO FACE</p>
          <div className={styles.facePreview}>
            <FaceIcon />
          </div>
          <button type="button" className={styles.customizeFaceButton} onClick={openFaceCustomizer}>
            😊 Customize Face
          </button>
        </div>
      </div>
      <div className={styles.heroActions}>
        <ShareButton shareContainerRef={shareContainerRef} />
      </div>
      <HeroCustomizer
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        initialSection={customizerSection}
      />
    </div>
  )
}
