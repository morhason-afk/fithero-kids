'use client'

import { useHero } from '@/contexts/HeroContext'
import { getIconElementById, EYES_OPTIONS, MOUTH_OPTIONS, ACCESSORY_OPTIONS, BACKGROUND_OPTIONS } from '@/data/iconCustomization'
import styles from './FaceIcon.module.css'

export default function FaceIcon() {
  const { hero } = useHero()
  const { iconCustomization } = hero.cosmetics

  const eyes = getIconElementById(iconCustomization.eyes) || EYES_OPTIONS[0]
  const mouth = getIconElementById(iconCustomization.mouth) || MOUTH_OPTIONS[0]
  const accessory = iconCustomization.accessory ? getIconElementById(iconCustomization.accessory) : null
  const background = getIconElementById(iconCustomization.background) || BACKGROUND_OPTIONS[0]

  return (
    <div className={styles.faceIconContainer}>
      <div className={styles.faceIcon}>
        {/* Background */}
        {background && background.id !== 'bg-default' && (
          <div className={styles.background} data-bg={background.id}>
            <span className={styles.backgroundEmoji}>{background.emoji}</span>
          </div>
        )}
        
        {/* Face base */}
        <div className={styles.faceBase}>
          {/* Accessory (on top) */}
          {accessory && accessory.id !== 'acc-none' && (
            <div className={styles.accessory}>
              <span className={styles.accessoryEmoji}>{accessory.emoji}</span>
            </div>
          )}
          
          {/* Eyes - extract eyes from emoji */}
          <div className={styles.eyes}>
            <span className={styles.eyesEmoji}>{eyes.emoji}</span>
          </div>
          
          {/* Mouth - extract mouth from emoji */}
          <div className={styles.mouth}>
            <span className={styles.mouthEmoji}>{mouth.emoji}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
