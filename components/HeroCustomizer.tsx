'use client'

import { useState, useEffect } from 'react'
import { useHero } from '@/contexts/HeroContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { trackEvent } from '@/utils/analytics'
import {
  SKIN_OPTIONS,
  OUTFIT_OPTIONS,
  CHARACTER_ACCESSORIES,
  type SkinOption,
  type OutfitOption,
  type CharacterAccessoryOption,
} from '@/data/characterOptions'
import { EYES_OPTIONS, MOUTH_OPTIONS, ACCESSORY_OPTIONS, BACKGROUND_OPTIONS, IconElement } from '@/data/iconCustomization'
import { heroRequiresSubscription, faceOptionRequiresSubscription } from '@/utils/subscription'
import HeroCharacter from './HeroCharacter'
import styles from './HeroCustomizer.module.css'

export type CustomizerSection = 'character' | 'face'

interface HeroCustomizerProps {
  isOpen: boolean
  onClose: () => void
  initialSection?: CustomizerSection
}

export default function HeroCustomizer({ isOpen, onClose, initialSection = 'character' }: HeroCustomizerProps) {
  const { hero, updateCosmetics, spendCoins, addOwnedItem, isItemOwned } = useHero()
  const { hasSubscription, showSubscriptionMessage } = useSubscription()
  const [activeTab, setActiveTab] = useState<CustomizerSection>(initialSection)

  useEffect(() => {
    if (isOpen) setActiveTab(initialSection)
  }, [isOpen, initialSection])

  const build = hero.cosmetics.characterBuild || { skinId: 'skin-default', outfitId: 'outfit-red', accessoryIds: ['acc-none'] }

  const handleSkinSelect = (skin: SkinOption, index: number) => {
    if (heroRequiresSubscription(index) && !hasSubscription) {
      showSubscriptionMessage('heroes')
      return
    }
    if (isItemOwned(skin.id)) {
      updateCosmetics({ characterBuild: { ...build, skinId: skin.id } })
      return
    }
    if (skin.cost === 0) {
      addOwnedItem(skin.id)
      updateCosmetics({ characterBuild: { ...build, skinId: skin.id } })
    } else if (spendCoins(skin.cost)) {
      addOwnedItem(skin.id)
      updateCosmetics({ characterBuild: { ...build, skinId: skin.id } })
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
      return
    }
    if (outfit.cost === 0) {
      addOwnedItem(outfit.id)
      updateCosmetics({ characterBuild: { ...build, outfitId: outfit.id } })
    } else if (spendCoins(outfit.cost)) {
      addOwnedItem(outfit.id)
      updateCosmetics({ characterBuild: { ...build, outfitId: outfit.id } })
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
    if (!isItemOwned(acc.id)) {
      if (acc.cost === 0) {
        addOwnedItem(acc.id)
        updateCosmetics({ characterBuild: { ...build, accessoryIds: newIds } })
      } else if (spendCoins(acc.cost)) {
        addOwnedItem(acc.id)
        updateCosmetics({ characterBuild: { ...build, accessoryIds: newIds } })
        trackEvent('purchase', { itemId: acc.id, itemCost: acc.cost })
      } else {
        alert(`Not enough diamonds! You need ${acc.cost} diamonds. You have ${hero.stats.totalCoins} diamonds.`)
        return
      }
    } else {
      updateCosmetics({ characterBuild: { ...build, accessoryIds: newIds } })
    }
  }

  const canAfford = (cost: number, itemId: string) => {
    if (isItemOwned(itemId)) return true
    return hero.stats.totalCoins >= cost
  }

  const isCharacterAccessoryActive = (id: string) => (build.accessoryIds || []).includes(id)

  const handleIconElementSelect = (element: IconElement, optionIndexInCategory: number) => {
    if (faceOptionRequiresSubscription(optionIndexInCategory) && !hasSubscription) {
      showSubscriptionMessage('face')
      return
    }
    // If already owned, just select it (no charge)
    if (isItemOwned(element.id)) {
      updateCosmetics({
        iconCustomization: {
          ...hero.cosmetics.iconCustomization,
          [element.category]: element.id
        }
      })
      return
    }

    if (element.cost === 0) {
      // Free element - mark as owned and select
      addOwnedItem(element.id)
      updateCosmetics({
        iconCustomization: {
          ...hero.cosmetics.iconCustomization,
          [element.category]: element.id
        }
      })
    } else {
      // Paid element - check if can afford and spend
      if (spendCoins(element.cost)) {
        addOwnedItem(element.id)
        updateCosmetics({
          iconCustomization: {
            ...hero.cosmetics.iconCustomization,
            [element.category]: element.id
          }
        })
        trackEvent('purchase', { itemId: element.id, itemCost: element.cost })
      } else {
        alert(`Not enough diamonds! You need ${element.cost} diamonds. You have ${hero.stats.totalCoins} diamonds.`)
      }
    }
  }

  const isIconElementSelected = (elementId: string, category: string) => {
    return hero.cosmetics.iconCustomization[category as keyof typeof hero.cosmetics.iconCustomization] === elementId
  }

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-label="Close"></div>
      <div className={styles.customizer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>🎨 Customize Your Hero</h2>
          <div className={styles.coinBalance}>
            <span className={styles.coinIcon}>💎</span>
            <span className={styles.coinAmount}>{hero.stats.totalCoins}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.preview}>
          <HeroCharacter />
        </div>

        <div className={styles.categoryTabs}>
          <button
            className={`${styles.categoryTab} ${activeTab === 'character' ? styles.active : ''}`}
            onClick={() => setActiveTab('character')}
          >
            🦸 Character
          </button>
          <button
            className={`${styles.categoryTab} ${activeTab === 'face' ? styles.active : ''}`}
            onClick={() => setActiveTab('face')}
          >
            😊 Face
          </button>
        </div>

        <p className={styles.subscriptionHint}>
          {activeTab === 'character'
            ? 'First 5 in each category (skin, outfit, accessories) free or for diamonds • Rest require subscription'
            : 'First 5 in each category (eyes, mouth, accessory, background) free or for diamonds • Rest require subscription'}
        </p>

        <div className={styles.options}>
          {activeTab === 'character' && (
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
                        <span className={styles.accessoryIcon}>{acc.type === 'crown' ? '👑' : acc.type === 'cape' ? '🦸' : acc.type === 'belt' ? '⛑️' : acc.type === 'gloves' ? '🥊' : acc.type === 'wings' ? '🪽' : '—'}</span>
                        <span className={styles.accessoryName}>{acc.name}</span>
                        {subLocked ? <span className={styles.subscribeText}>Subscribe</span> : isItemOwned(acc.id) ? <span className={styles.ownedText}>Owned</span> : acc.cost > 0 ? <span className={styles.costText}>{acc.cost}💎</span> : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === 'face' && (
            <>
          <div className={styles.faceSectionIntro}>
            <h3 className={styles.faceSectionTitle}>Customize your hero&apos;s face</h3>
            <p className={styles.faceSectionDesc}>Pick eyes, mouth, a fun accessory, and a background.</p>
          </div>

          <div className={styles.optionGroup}>
            <label>Eyes</label>
                <div className={styles.iconGrid}>
                  {EYES_OPTIONS.map((element, idx) => {
                    const subLocked = faceOptionRequiresSubscription(idx) && !hasSubscription
                    return (
                    <button
                      key={element.id}
                      className={`${styles.iconButton} ${
                        isIconElementSelected(element.id, 'eyes') ? styles.active : ''
                      } ${!subLocked && !canAfford(element.cost, element.id) && element.cost > 0 ? styles.disabled : ''} ${subLocked ? styles.subscriptionLocked : ''}`}
                      onClick={() => handleIconElementSelect(element, idx)}
                      disabled={!subLocked && !canAfford(element.cost, element.id) && element.cost > 0}
                      title={subLocked ? 'Subscribe to unlock' : isItemOwned(element.id) ? 'Owned' : element.cost === 0 ? 'Free' : `${element.cost} diamonds`}
                    >
                      <span className={styles.iconEmoji}>{element.emoji}</span>
                      <span className={styles.iconName}>{element.name}</span>
                      {subLocked ? (
                        <span className={styles.subscribeText}>Subscribe</span>
                      ) : isItemOwned(element.id) ? (
                        <span className={styles.ownedText}>Owned</span>
                      ) : element.cost > 0 ? (
                        <span className={styles.costText}>{element.cost}💎</span>
                      ) : null}
                    </button>
                  )})}
                </div>
              </div>

              {/* Mouth */}
              <div className={styles.optionGroup}>
                <label>Mouth</label>
                <div className={styles.iconGrid}>
                  {MOUTH_OPTIONS.map((element, idx) => {
                    const subLocked = faceOptionRequiresSubscription(idx) && !hasSubscription
                    return (
                    <button
                      key={element.id}
                      className={`${styles.iconButton} ${
                        isIconElementSelected(element.id, 'mouth') ? styles.active : ''
                      } ${!subLocked && !canAfford(element.cost, element.id) && element.cost > 0 ? styles.disabled : ''} ${subLocked ? styles.subscriptionLocked : ''}`}
                      onClick={() => handleIconElementSelect(element, idx)}
                      disabled={!subLocked && !canAfford(element.cost, element.id) && element.cost > 0}
                      title={subLocked ? 'Subscribe to unlock' : isItemOwned(element.id) ? 'Owned' : element.cost === 0 ? 'Free' : `${element.cost} diamonds`}
                    >
                      <span className={styles.iconEmoji}>{element.emoji}</span>
                      <span className={styles.iconName}>{element.name}</span>
                      {subLocked ? (
                        <span className={styles.subscribeText}>Subscribe</span>
                      ) : isItemOwned(element.id) ? (
                        <span className={styles.ownedText}>Owned</span>
                      ) : element.cost > 0 ? (
                        <span className={styles.costText}>{element.cost}💎</span>
                      ) : null}
                    </button>
                  )})}
                </div>
              </div>

              {/* Accessories */}
              <div className={styles.optionGroup}>
                <label>Icon Accessories</label>
                <div className={styles.iconGrid}>
                  {ACCESSORY_OPTIONS.map((element, idx) => {
                    const subLocked = faceOptionRequiresSubscription(idx) && !hasSubscription
                    return (
                    <button
                      key={element.id}
                      className={`${styles.iconButton} ${
                        isIconElementSelected(element.id, 'accessory') ? styles.active : ''
                      } ${!subLocked && !canAfford(element.cost, element.id) && element.cost > 0 ? styles.disabled : ''} ${subLocked ? styles.subscriptionLocked : ''}`}
                      onClick={() => handleIconElementSelect(element, idx)}
                      disabled={!subLocked && !canAfford(element.cost, element.id) && element.cost > 0}
                      title={subLocked ? 'Subscribe to unlock' : isItemOwned(element.id) ? 'Owned' : element.cost === 0 ? 'Free' : `${element.cost} diamonds`}
                    >
                      <span className={styles.iconEmoji}>{element.emoji || 'None'}</span>
                      <span className={styles.iconName}>{element.name}</span>
                      {subLocked ? (
                        <span className={styles.subscribeText}>Subscribe</span>
                      ) : isItemOwned(element.id) ? (
                        <span className={styles.ownedText}>Owned</span>
                      ) : element.cost > 0 ? (
                        <span className={styles.costText}>{element.cost}💎</span>
                      ) : null}
                    </button>
                  )})}
                </div>
              </div>

              {/* Background */}
              <div className={styles.optionGroup}>
                <label>Background</label>
                <div className={styles.iconGrid}>
                  {BACKGROUND_OPTIONS.map((element, idx) => {
                    const subLocked = faceOptionRequiresSubscription(idx) && !hasSubscription
                    return (
                    <button
                      key={element.id}
                      className={`${styles.iconButton} ${
                        isIconElementSelected(element.id, 'background') ? styles.active : ''
                      } ${!subLocked && !canAfford(element.cost, element.id) && element.cost > 0 ? styles.disabled : ''} ${subLocked ? styles.subscriptionLocked : ''}`}
                      onClick={() => handleIconElementSelect(element, idx)}
                      disabled={!subLocked && !canAfford(element.cost, element.id) && element.cost > 0}
                      title={subLocked ? 'Subscribe to unlock' : isItemOwned(element.id) ? 'Owned' : element.cost === 0 ? 'Free' : `${element.cost} diamonds`}
                    >
                      <span className={styles.iconEmoji}>{element.emoji}</span>
                      <span className={styles.iconName}>{element.name}</span>
                      {subLocked ? (
                        <span className={styles.subscribeText}>Subscribe</span>
                      ) : isItemOwned(element.id) ? (
                        <span className={styles.ownedText}>Owned</span>
                      ) : element.cost > 0 ? (
                        <span className={styles.costText}>{element.cost}💎</span>
                      ) : null}
                    </button>
                  )})}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
