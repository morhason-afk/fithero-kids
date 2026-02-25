'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useHero } from '@/contexts/HeroContext'
import { useConfig } from '@/contexts/ConfigContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { trackEvent } from '@/utils/analytics'
import {
  SKIN_OPTIONS,
  OUTFIT_OPTIONS,
  CHARACTER_ACCESSORIES,
  FACE_EXPRESSIONS,
  type SkinOption,
  type OutfitOption,
  type CharacterAccessoryOption,
  type FaceExpressionOption,
} from '@/data/characterOptions'
import { heroRequiresSubscription } from '@/utils/subscription'
import HeroCharacter from './HeroCharacter'
import styles from './HeroCustomizer.module.css'

export type CustomizerSection = 'character'

interface HeroCustomizerProps {
  isOpen: boolean
  onClose: () => void
  initialSection?: CustomizerSection
}

export default function HeroCustomizer({ isOpen, onClose, initialSection = 'character' }: HeroCustomizerProps) {
  const { hero, updateCosmetics, addXp, spendCoins, addOwnedItem, isItemOwned } = useHero()
  const { config } = useConfig()
  const { hasSubscription, showSubscriptionMessage } = useSubscription()
  const xpPerCustomization = typeof config.xpPerCustomization === 'number' && config.xpPerCustomization >= 0 ? config.xpPerCustomization : 1
  const [activeTab, setActiveTab] = useState<CustomizerSection>(initialSection)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isOpen) setActiveTab(initialSection)
  }, [isOpen, initialSection])

  const build = hero.cosmetics.characterBuild || { skinId: 'skin-default', outfitId: 'outfit-red', accessoryIds: ['acc-none'], expressionId: 'face-happy' }
  const currentExpressionId = build.expressionId || 'face-happy'

  const handleSkinSelect = (skin: SkinOption, index: number) => {
    if (heroRequiresSubscription(index) && !hasSubscription) {
      showSubscriptionMessage('heroes')
      return
    }
    if (isItemOwned(skin.id)) {
      updateCosmetics({ characterBuild: { ...build, skinId: skin.id } })
      if (skin.id !== build.skinId) addXp(xpPerCustomization)
      return
    }
    if (skin.cost === 0) {
      addOwnedItem(skin.id)
      updateCosmetics({ characterBuild: { ...build, skinId: skin.id } })
      if (skin.id !== build.skinId) addXp(xpPerCustomization)
    } else if (spendCoins(skin.cost)) {
      addOwnedItem(skin.id)
      updateCosmetics({ characterBuild: { ...build, skinId: skin.id } })
      if (skin.id !== build.skinId) addXp(xpPerCustomization)
      trackEvent('purchase', { itemId: skin.id, itemCost: skin.cost })
    } else {
      alert(`Not enough diamonds! You need ${skin.cost} diamonds. You have ${hero.stats.totalCoins} diamonds.`)
    }
  }

  const handleOutfitSelect = (outfit: OutfitOption, index: number) => {
    if (heroRequiresSubscription(index) && !hasSubscription) {
      showSubscriptionMessage('heroes')
      return
    }
    if (isItemOwned(outfit.id)) {
      updateCosmetics({ characterBuild: { ...build, outfitId: outfit.id } })
      if (outfit.id !== build.outfitId) addXp(xpPerCustomization)
      return
    }
    if (outfit.cost === 0) {
      addOwnedItem(outfit.id)
      updateCosmetics({ characterBuild: { ...build, outfitId: outfit.id } })
      if (outfit.id !== build.outfitId) addXp(xpPerCustomization)
    } else if (spendCoins(outfit.cost)) {
      addOwnedItem(outfit.id)
      updateCosmetics({ characterBuild: { ...build, outfitId: outfit.id } })
      if (outfit.id !== build.outfitId) addXp(xpPerCustomization)
      trackEvent('purchase', { itemId: outfit.id, itemCost: outfit.cost })
    } else {
      alert(`Not enough diamonds! You need ${outfit.cost} diamonds. You have ${hero.stats.totalCoins} diamonds.`)
    }
  }

  const handleCharacterAccessoryToggle = (acc: CharacterAccessoryOption, index: number) => {
    if (heroRequiresSubscription(index) && !hasSubscription) {
      showSubscriptionMessage('heroes')
      return
    }
    const current = build.accessoryIds || []
    const hasIt = current.includes(acc.id)
    const newIds = hasIt ? current.filter(id => id !== acc.id) : [...current.filter(id => id !== 'acc-none'), acc.id]
    const accessoryChanged = JSON.stringify(newIds) !== JSON.stringify(current)
    if (!isItemOwned(acc.id)) {
      if (acc.cost === 0) {
        addOwnedItem(acc.id)
        updateCosmetics({ characterBuild: { ...build, accessoryIds: newIds } })
        if (accessoryChanged) addXp(xpPerCustomization)
      } else if (spendCoins(acc.cost)) {
        addOwnedItem(acc.id)
        updateCosmetics({ characterBuild: { ...build, accessoryIds: newIds } })
        if (accessoryChanged) addXp(xpPerCustomization)
        trackEvent('purchase', { itemId: acc.id, itemCost: acc.cost })
      } else {
        alert(`Not enough diamonds! You need ${acc.cost} diamonds. You have ${hero.stats.totalCoins} diamonds.`)
        return
      }
    } else {
      updateCosmetics({ characterBuild: { ...build, accessoryIds: newIds } })
      if (accessoryChanged) addXp(xpPerCustomization)
    }
  }

  const canAfford = (cost: number, itemId: string) => {
    if (isItemOwned(itemId)) return true
    return hero.stats.totalCoins >= cost
  }

  const isCharacterAccessoryActive = (id: string) => (build.accessoryIds || []).includes(id)

  const handleExpressionSelect = (expr: FaceExpressionOption, index: number) => {
    if (heroRequiresSubscription(index) && !hasSubscription) {
      showSubscriptionMessage('heroes')
      return
    }
    if (isItemOwned(expr.id)) {
      updateCosmetics({ characterBuild: { ...build, expressionId: expr.id } })
      if (expr.id !== currentExpressionId) addXp(xpPerCustomization)
      return
    }
    if (expr.cost === 0) {
      addOwnedItem(expr.id)
      updateCosmetics({ characterBuild: { ...build, expressionId: expr.id } })
      if (expr.id !== currentExpressionId) addXp(xpPerCustomization)
    } else if (spendCoins(expr.cost)) {
      addOwnedItem(expr.id)
      updateCosmetics({ characterBuild: { ...build, expressionId: expr.id } })
      if (expr.id !== currentExpressionId) addXp(xpPerCustomization)
      trackEvent('purchase', { itemId: expr.id, itemCost: expr.cost })
    } else {
      alert(`Not enough diamonds! You need ${expr.cost} diamonds. You have ${hero.stats.totalCoins} diamonds.`)
    }
  }

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  const modalContent = !isOpen ? null : (
    <>
      <div className={styles.overlay} onClick={onClose} aria-label="Close"></div>
      <div className={styles.customizer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>🎨 Customize Your Hero</h2>
          <div className={styles.coinBalance}>
            <span className={styles.coinIcon}>💎</span>
            <span className={styles.coinAmount}>{hero.stats.totalCoins}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className={styles.preview}>
          <HeroCharacter />
        </div>

        <p className={styles.subscriptionHint}>
          First 5 in each category (skin, outfit, accessories) free or for diamonds • Rest require subscription
        </p>

        <div className={styles.options}>
          <>
          <div className={styles.optionGroup}>
            <label>Skin</label>
                <div className={styles.colorGrid}>
                  {SKIN_OPTIONS.map((skin, idx) => {
                    const subLocked = heroRequiresSubscription(idx) && !hasSubscription
                    return (
                      <button
                        key={skin.id}
                        className={`${styles.colorSwatch} ${build.skinId === skin.id ? styles.active : ''} ${subLocked ? styles.subscriptionLocked : ''}`}
                        style={{ background: skin.color }}
                        onClick={() => handleSkinSelect(skin, idx)}
                        title={subLocked ? 'Requires subscription' : skin.name}
                      >
                        {subLocked && <span className={styles.swatchSubscriptionLabel} title="Requires subscription">🔒</span>}
                        {build.skinId === skin.id && !subLocked && <span className={styles.ownedBadge}>✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className={styles.optionGroup}>
                <label>Outfit</label>
                <div className={styles.outfitGrid}>
                  {OUTFIT_OPTIONS.map((outfit, idx) => {
                    const subLocked = heroRequiresSubscription(idx) && !hasSubscription
                    return (
                      <button
                        key={outfit.id}
                        className={`${styles.outfitCard} ${build.outfitId === outfit.id ? styles.active : ''} ${subLocked ? styles.subscriptionLocked : ''}`}
                        onClick={() => handleOutfitSelect(outfit, idx)}
                        title={subLocked ? 'Requires subscription' : `${outfit.name}${outfit.cost > 0 ? ` – ${outfit.cost}💎` : ''}`}
                      >
                        <div className={styles.outfitPreview} style={{ background: `linear-gradient(180deg, ${outfit.bodyColor} 50%, ${outfit.legColor} 50%)` }} />
                        <span className={styles.heroName}>{outfit.name}</span>
                        {subLocked ? <span className={styles.subscribeText}>Subscribe</span> : !isItemOwned(outfit.id) && outfit.cost > 0 && <span className={styles.costText}>{outfit.cost}💎</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className={styles.optionGroup}>
                <label>Accessories</label>
                <div className={styles.accessoryGrid}>
                  {CHARACTER_ACCESSORIES.map((acc, idx) => {
                    const subLocked = heroRequiresSubscription(idx) && !hasSubscription
                    const active = isCharacterAccessoryActive(acc.id)
                    return (
                      <button
                        key={acc.id}
                        className={`${styles.accessoryButton} ${active ? styles.active : ''} ${subLocked ? styles.subscriptionLocked : ''} ${!subLocked && !canAfford(acc.cost, acc.id) && acc.cost > 0 ? styles.disabled : ''}`}
                        onClick={() => handleCharacterAccessoryToggle(acc, idx)}
                        disabled={!subLocked && !canAfford(acc.cost, acc.id) && acc.cost > 0}
                        title={subLocked ? 'Subscribe' : acc.name}
                      >
                        <span className={styles.accessoryIcon}>{acc.type === 'crown' ? '👑' : acc.type === 'cape' ? '🦸' : acc.type === 'belt' ? '⛑️' : acc.type === 'gloves' ? '🥊' : acc.type === 'wings' ? '🪽' : acc.type === 'scarf' ? '🧣' : acc.type === 'shield' ? '🛡️' : acc.type === 'halo' ? '😇' : acc.type === 'mask' ? '🎭' : acc.type === 'backpack' ? '🎒' : '—'}</span>
                        <span className={styles.accessoryName}>{acc.name}</span>
                        {subLocked ? <span className={styles.subscribeText}>Subscribe</span> : isItemOwned(acc.id) ? <span className={styles.ownedText}>Owned</span> : acc.cost > 0 ? <span className={styles.costText}>{acc.cost}💎</span> : null}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className={styles.optionGroup}>
                <label>Face</label>
                <div className={styles.outfitGrid}>
                  {FACE_EXPRESSIONS.map((expr, idx) => {
                    const subLocked = heroRequiresSubscription(idx) && !hasSubscription
                    const active = currentExpressionId === expr.id
                    const faceEmoji = expr.eyes === 'stars' ? '🤩' : expr.eyes === 'hearts' ? '😍' : expr.eyes === 'sad' ? '😢' : expr.eyes === 'surprised' ? '😲' : expr.eyes === 'wink' ? '😉' : expr.eyes === 'angry' ? '😤' : expr.eyes === 'sleepy' ? '😴' : expr.mouth === 'tongue' ? '😛' : '😊'
                    return (
                      <button
                        key={expr.id}
                        className={`${styles.outfitCard} ${active ? styles.active : ''} ${subLocked ? styles.subscriptionLocked : ''}`}
                        onClick={() => handleExpressionSelect(expr, idx)}
                        title={subLocked ? 'Requires subscription' : `${expr.name}${expr.cost > 0 ? ` – ${expr.cost}💎` : ''}`}
                      >
                        <div className={styles.facePreview}>
                          <span className={styles.faceEmoji} aria-hidden>{faceEmoji}</span>
                        </div>
                        <span className={styles.heroName}>{expr.name}</span>
                        {subLocked ? <span className={styles.subscribeText}>Subscribe</span> : !isItemOwned(expr.id) && expr.cost > 0 && <span className={styles.costText}>{expr.cost}💎</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
          </>
        </div>
      </div>
    </>
  )

  if (!mounted || typeof document === 'undefined' || !isOpen) return null
  return createPortal(modalContent, document.body)
}
