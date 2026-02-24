'use client'

import { useHero } from '@/contexts/HeroContext'
import type { CharacterBuild } from '@/types/hero'
import {
  getSkinById,
  getOutfitById,
  getCharacterAccessoryById,
  DEFAULT_SKIN_ID,
  DEFAULT_OUTFIT_ID,
  type CharacterAccessoryOption,
} from '@/data/characterOptions'
import styles from './ScalableCharacter.module.css'

export default function ScalableCharacter() {
  const { hero } = useHero()
  const build: CharacterBuild = hero.cosmetics.characterBuild || {
    skinId: DEFAULT_SKIN_ID,
    outfitId: DEFAULT_OUTFIT_ID,
    accessoryIds: [],
  }
  const skin = getSkinById(build.skinId) || getSkinById(DEFAULT_SKIN_ID)!
  const outfit = getOutfitById(build.outfitId) || getOutfitById(DEFAULT_OUTFIT_ID)!
  const accessories = (build.accessoryIds || [])
    .map(id => getCharacterAccessoryById(id))
    .filter((a): a is CharacterAccessoryOption => a != null && a.id !== 'acc-none')

  const hasCape = accessories.some(a => a.type === 'cape')
  const capeColor = accessories.find(a => a.type === 'cape')?.color || '#B71C1C'
  const hasCrown = accessories.some(a => a.type === 'crown')
  const crownColor = accessories.find(a => a.type === 'crown')?.color || '#FFD700'
  const hasBelt = accessories.some(a => a.type === 'belt')
  const beltColor = accessories.find(a => a.type === 'belt')?.color || '#5D4037'
  const hasGloves = accessories.some(a => a.type === 'gloves')
  const glovesColor = accessories.find(a => a.type === 'gloves')?.color || '#FFF'
  const hasWings = accessories.some(a => a.type === 'wings')
  const wingsColor = accessories.find(a => a.type === 'wings')?.color || '#B0BEC5'

  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.character}
        viewBox="0 0 120 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Your hero character"
      >
        {/* Cape (behind body) */}
        {hasCape && (
          <path
            d="M 60 52 Q 20 55 25 95 Q 30 140 60 185 Q 90 140 95 95 Q 100 55 60 52 Z"
            fill={capeColor}
            opacity={0.95}
          />
        )}
        {/* Wings (behind) */}
        {hasWings && (
          <g opacity={0.9}>
            <path d="M 20 70 Q 0 90 5 130 Q 10 160 35 140" stroke={wingsColor} strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 100 70 Q 120 90 115 130 Q 110 160 85 140" stroke={wingsColor} strokeWidth="6" fill="none" strokeLinecap="round" />
          </g>
        )}
        {/* Legs */}
        <rect x="42" y="140" width="16" height="50" rx="4" fill={outfit.legColor} />
        <rect x="62" y="140" width="16" height="50" rx="4" fill={outfit.legColor} />
        {/* Torso / body */}
        <rect x="35" y="75" width="50" height="70" rx="10" fill={outfit.bodyColor} />
        {/* Arms */}
        <rect x="18" y="82" width="18" height="45" rx="6" fill={outfit.bodyColor} transform="rotate(-15 27 105)" />
        <rect x="84" y="82" width="18" height="45" rx="6" fill={outfit.bodyColor} transform="rotate(15 93 105)" />
        {/* Gloves */}
        {hasGloves && (
          <>
            <rect x="16" y="120" width="20" height="18" rx="4" fill={glovesColor} transform="rotate(-15 26 129)" />
            <rect x="84" y="120" width="20" height="18" rx="4" fill={glovesColor} transform="rotate(15 94 129)" />
          </>
        )}
        {/* Belt */}
        {hasBelt && (
          <rect x="36" y="135" width="48" height="12" rx="2" fill={beltColor} />
        )}
        {/* Head */}
        <circle cx="60" cy="45" r="28" fill={skin.color} />
        {/* Crown */}
        {hasCrown && (
          <path
            d="M 35 28 L 45 18 L 60 28 L 75 18 L 85 28 L 85 38 L 35 38 Z"
            fill={crownColor}
            stroke="#B8860B"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  )
}
