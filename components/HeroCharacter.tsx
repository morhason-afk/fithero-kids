'use client'

import { useHero } from '@/contexts/HeroContext'
import { getHeroById, getDefaultHero } from '@/data/heroes'
import Image from 'next/image'
import FaceIcon from './FaceIcon'
import styles from './HeroCharacter.module.css'

export default function HeroCharacter() {
  const { hero } = useHero()
  const { stats, cosmetics } = hero
  
  const selectedHero = getHeroById(cosmetics.selectedHeroId) || getDefaultHero()
  
  // Calculate aspect ratio for cropped heroes
  const aspectRatio = selectedHero.cropWidth && selectedHero.cropHeight
    ? `${selectedHero.cropWidth} / ${selectedHero.cropHeight}`
    : undefined

  return (
    <div className={styles.heroCard}>
      <div className={styles.heroCardContent}>
        <p className={styles.heroLabel}>YOUR HERO</p>
        
        {/* Face Icon */}
        <FaceIcon />
        
        {/* Hero Character Image */}
        <div className={styles.characterWrapper}>
          <div className={styles.heroImageContainer}>
            {selectedHero.cropWidth !== undefined ? (
              <div 
                className={styles.croppedHeroImage}
                style={{
                  backgroundImage: `url(${selectedHero.image})`,
                  backgroundSize: `${100 / (selectedHero.cropWidth! / 100)}% ${100 / ((selectedHero.cropHeight || 100) / 100)}%`,
                  backgroundPosition: `${selectedHero.cropX || 0}% ${selectedHero.cropY || 0}%`,
                  backgroundRepeat: 'no-repeat',
                  aspectRatio: aspectRatio,
                  maxWidth: '100%',
                  width: '100%'
                }}
              />
            ) : (
              <Image
                src={selectedHero.image}
                alt={selectedHero.name}
                width={600}
                height={800}
                className={styles.heroImage}
                priority
                unoptimized
              />
            )}
          </div>
        </div>
        
        <h3 className={styles.heroName}>{selectedHero.name}</h3>
        <p className={styles.heroSubtitle}>Level {stats.level} • Champion</p>
      </div>
    </div>
  )
}
