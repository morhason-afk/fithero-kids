'use client'

import { useHero } from '@/contexts/HeroContext'
import type { CharacterBuild } from '@/types/hero'
import {
  getSkinById,
  getOutfitById,
  getCharacterAccessoryById,
  getExpressionById,
  DEFAULT_SKIN_ID,
  DEFAULT_OUTFIT_ID,
  DEFAULT_EXPRESSION_ID,
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
  const expression = getExpressionById(build.expressionId || '') || getExpressionById(DEFAULT_EXPRESSION_ID)!
  const accessories = (build.accessoryIds || [])
    .map(id => getCharacterAccessoryById(id))
    .filter((a): a is CharacterAccessoryOption => a != null && a.id !== 'acc-none')

  const hasCape = accessories.some(a => a.type === 'cape')
  const capeColor = accessories.find(a => a.type === 'cape')?.color || '#B71C1C'
  const hasScarf = accessories.some(a => a.type === 'scarf')
  const scarfColor = accessories.find(a => a.type === 'scarf')?.color || '#E91E63'
  const hasCrown = accessories.some(a => a.type === 'crown')
  const crownColor = accessories.find(a => a.type === 'crown')?.color || '#FFD700'
  const hasBelt = accessories.some(a => a.type === 'belt')
  const beltColor = accessories.find(a => a.type === 'belt')?.color || '#5D4037'
  const hasGloves = accessories.some(a => a.type === 'gloves')
  const glovesColor = accessories.find(a => a.type === 'gloves')?.color || '#FFF'
  const hasWings = accessories.some(a => a.type === 'wings')
  const wingsColor = accessories.find(a => a.type === 'wings')?.color || '#B0BEC5'
  const hasHalo = accessories.some(a => a.type === 'halo')
  const haloColor = accessories.find(a => a.type === 'halo')?.color || '#FFF59D'
  const hasMask = accessories.some(a => a.type === 'mask')
  const maskColor = accessories.find(a => a.type === 'mask')?.color || '#37474F'
  const hasBackpack = accessories.some(a => a.type === 'backpack')
  const backpackColor = accessories.find(a => a.type === 'backpack')?.color || '#795548'
  const hasShield = accessories.some(a => a.type === 'shield')
  const shieldColor = accessories.find(a => a.type === 'shield')?.color || '#607D8B'

  const eyes = expression.eyes
  const mouth = expression.mouth

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
        {/* Backpack (behind body) */}
        {hasBackpack && (
          <rect x="38" y="80" width="44" height="55" rx="8" fill={backpackColor} opacity={0.95} />
        )}
        {/* Cape (behind body) */}
        {hasCape && (
          <path
            d="M 60 52 Q 20 55 25 95 Q 30 140 60 185 Q 90 140 95 95 Q 100 55 60 52 Z"
            fill={capeColor}
            opacity={0.95}
          />
        )}
        {/* Scarf (behind shoulders) */}
        {hasScarf && (
          <path
            d="M 60 52 Q 25 58 30 75 Q 35 90 60 90 Q 85 90 90 75 Q 95 58 60 52 Z"
            fill={scarfColor}
            opacity={0.9}
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
        {/* Shield (on arm) */}
        {hasShield && (
          <ellipse cx="28" cy="100" rx="10" ry="14" fill={shieldColor} stroke="#455A64" strokeWidth="1" transform="rotate(-15 28 100)" />
        )}
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
        {/* Halo */}
        {hasHalo && (
          <circle cx="60" cy="18" r="12" fill="none" stroke={haloColor} strokeWidth="3" opacity={0.9} />
        )}
        {/* Face: eyes (head center ~60,45, eyes ~50,40 and ~70,40, mouth ~60,52) */}
        <g fill="#2C1810" stroke="#2C1810" strokeWidth="1.5">
          {/* Eyes */}
          {eyes === 'default' && (
            <>
              <ellipse cx="50" cy="40" rx="4" ry="5" />
              <ellipse cx="70" cy="40" rx="4" ry="5" />
            </>
          )}
          {eyes === 'happy' && (
            <>
              <path d="M 46 42 Q 50 38 54 42" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 66 42 Q 70 38 74 42" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          )}
          {eyes === 'sad' && (
            <>
              <path d="M 46 38 Q 50 42 54 38" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 66 38 Q 70 42 74 38" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          )}
          {eyes === 'surprised' && (
            <>
              <circle cx="50" cy="40" r="5" />
              <circle cx="70" cy="40" r="5" />
            </>
          )}
          {eyes === 'stars' && (
            <>
              <path d="M 50 38 L 51 41 L 54 41 L 52 43 L 53 46 L 50 44 L 47 46 L 48 43 L 46 41 L 49 41 Z" fill="#2C1810" />
              <path d="M 70 38 L 71 41 L 74 41 L 72 43 L 73 46 L 70 44 L 67 46 L 68 43 L 66 41 L 69 41 Z" fill="#2C1810" />
            </>
          )}
          {eyes === 'hearts' && (
            <>
              <path d="M 50 42 C 48 38 44 38 46 41 C 48 44 50 46 50 46 C 50 46 52 44 54 41 C 56 38 52 38 50 42 Z" fill="#E91E63" stroke="#C2185B" />
              <path d="M 70 42 C 68 38 64 38 66 41 C 68 44 70 46 70 46 C 70 46 72 44 74 41 C 76 38 72 38 70 42 Z" fill="#E91E63" stroke="#C2185B" />
            </>
          )}
          {eyes === 'wink' && (
            <>
              <path d="M 46 42 Q 50 38 54 42" strokeWidth="2" fill="none" strokeLinecap="round" />
              <line x1="66" y1="40" x2="74" y2="40" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
          {eyes === 'angry' && (
            <>
              <path d="M 44 38 L 54 42" strokeWidth="2" strokeLinecap="round" />
              <path d="M 66 42 L 76 38" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
          {eyes === 'sleepy' && (
            <>
              <line x1="46" y1="42" x2="54" y2="42" strokeWidth="2" strokeLinecap="round" />
              <line x1="66" y1="42" x2="74" y2="42" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </g>
        {/* Mouth */}
        <g fill="none" stroke="#2C1810" strokeWidth="2" strokeLinecap="round">
          {mouth === 'smile' && <path d="M 48 54 Q 60 62 72 54" />}
          {mouth === 'frown' && <path d="M 48 58 Q 60 50 72 58" />}
          {mouth === 'open' && <ellipse cx="60" cy="56" rx="6" ry="8" fill="#2C1810" />}
          {mouth === 'neutral' && <line x1="48" y1="55" x2="72" y2="55" />}
          {mouth === 'tongue' && (
            <>
              <path d="M 48 54 Q 60 62 72 54" />
              <ellipse cx="60" cy="62" rx="4" ry="6" fill="#E91E63" stroke="#C2185B" />
            </>
          )}
          {mouth === 'bigSmile' && <path d="M 44 52 Q 60 64 76 52" />}
        </g>
        {/* Mask (over eyes) */}
        {hasMask && (
          <path
            d="M 35 32 Q 60 28 85 32 Q 88 42 85 48 Q 60 52 35 48 Q 32 42 35 32 Z"
            fill={maskColor}
            opacity={0.95}
            stroke="#263238"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  )
}
