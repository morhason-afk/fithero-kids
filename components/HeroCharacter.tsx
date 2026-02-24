'use client'

import { forwardRef } from 'react'
import { useHero } from '@/contexts/HeroContext'
import { getOutfitById, DEFAULT_OUTFIT_ID } from '@/data/characterOptions'
import ScalableCharacter from './ScalableCharacter'
import styles from './HeroCharacter.module.css'

const HeroCharacter = forwardRef<HTMLDivElement, object>(function HeroCharacter(_, ref) {
  const { hero } = useHero()
  const { stats, cosmetics } = hero
  const build = cosmetics.characterBuild
  const outfit = build?.outfitId ? getOutfitById(build.outfitId) : getOutfitById(DEFAULT_OUTFIT_ID)
  const displayName = outfit?.name ?? 'My Hero'

  return (
    <div className={styles.heroCard}>
      <div ref={ref} className={styles.heroCardContent}>
        <p className={styles.heroLabel}>YOUR HERO</p>
        <div className={styles.heroRow}>
          <div className={styles.heroLeft}>
            <div className={styles.characterWrapper}>
              <div className={styles.heroImageContainer}>
                <ScalableCharacter />
              </div>
            </div>
            <h3 className={styles.heroName}>{displayName}</h3>
            <p className={styles.heroSubtitle}>Level {stats.level} • Champion</p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default HeroCharacter
