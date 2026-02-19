'use client'

import { useState } from 'react'
import { useHero } from '@/contexts/HeroContext'
import { trackEvent } from '@/utils/analytics'
import { HERO_OPTIONS, ACCESSORIES, HeroOption } from '@/data/heroes'
import { EYES_OPTIONS, MOUTH_OPTIONS, ACCESSORY_OPTIONS, BACKGROUND_OPTIONS, IconElement } from '@/data/iconCustomization'
import HeroCharacter from './HeroCharacter'
import Image from 'next/image'
import styles from './HeroCustomizer.module.css'

export default function HeroCustomizer() {
  const { hero, updateCosmetics, spendCoins, addOwnedItem, isItemOwned } = useHero()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'heroes' | 'icon'>('heroes')

  const handleHeroSelect = (heroOption: HeroOption) => {
    // If already owned, just select it (no charge)
    if (isItemOwned(heroOption.id)) {
      updateCosmetics({ selectedHeroId: heroOption.id })
      return
    }

    if (heroOption.cost === 0) {
      // Free hero - mark as owned and select
      addOwnedItem(heroOption.id)
      updateCosmetics({ selectedHeroId: heroOption.id })
    } else {
      // Paid hero - check if can afford and spend
      if (spendCoins(heroOption.cost)) {
        addOwnedItem(heroOption.id) // Mark as owned
        updateCosmetics({ selectedHeroId: heroOption.id })
        trackEvent('purchase', { itemId: heroOption.id, itemCost: heroOption.cost })
      } else {
        alert(`Not enough coins! You need ${heroOption.cost} coins. You have ${hero.stats.totalCoins} coins.`)
      }
    }
  }

  const handleAccessoryToggle = (accessory: HeroOption) => {
    const hasAccessory = hero.cosmetics.accessories.includes(accessory.id)
    const newAccessories = hasAccessory
      ? hero.cosmetics.accessories.filter(a => a !== accessory.id)
      : [...hero.cosmetics.accessories, accessory.id]
    
    // If not owned, try to purchase
    if (!isItemOwned(accessory.id)) {
      if (accessory.cost === 0) {
        addOwnedItem(accessory.id)
        updateCosmetics({ accessories: newAccessories })
      } else if (spendCoins(accessory.cost)) {
        addOwnedItem(accessory.id)
        updateCosmetics({ accessories: newAccessories })
        trackEvent('purchase', { itemId: accessory.id, itemCost: accessory.cost })
      } else {
        alert(`Not enough coins! You need ${accessory.cost} coins. You have ${hero.stats.totalCoins} coins.`)
        return
      }
    } else {
      updateCosmetics({ accessories: newAccessories })
    }
  }

  const canAfford = (cost: number, itemId: string) => {
    // If owned, can always "afford" (it's free)
    if (isItemOwned(itemId)) return true
    return hero.stats.totalCoins >= cost
  }

  const isHeroSelected = (heroId: string) => {
    return hero.cosmetics.selectedHeroId === heroId
  }

  const isAccessoryActive = (accessoryId: string) => {
    return hero.cosmetics.accessories.includes(accessoryId)
  }

  const handleIconElementSelect = (element: IconElement) => {
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
        alert(`Not enough coins! You need ${element.cost} coins. You have ${hero.stats.totalCoins} coins.`)
      }
    }
  }

  const isIconElementSelected = (elementId: string, category: string) => {
    return hero.cosmetics.iconCustomization[category as keyof typeof hero.cosmetics.iconCustomization] === elementId
  }

  if (!isOpen) {
    return (
      <button className={styles.openButton} onClick={() => setIsOpen(true)}>
        🎨 Customize Hero
      </button>
    )
  }

  return (
    <>
      <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>
      <div className={styles.customizer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>🎨 Customize Your Hero</h2>
          <div className={styles.coinBalance}>
            <span className={styles.coinIcon}>💎</span>
            <span className={styles.coinAmount}>{hero.stats.totalCoins}</span>
          </div>
          <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className={styles.preview}>
          <HeroCharacter />
        </div>

        {/* Tabs */}
        <div className={styles.categoryTabs}>
          <button
            className={`${styles.categoryTab} ${activeTab === 'heroes' ? styles.active : ''}`}
            onClick={() => setActiveTab('heroes')}
          >
            🦸 Heroes
          </button>
          <button
            className={`${styles.categoryTab} ${activeTab === 'icon' ? styles.active : ''}`}
            onClick={() => setActiveTab('icon')}
          >
            😊 Face Icon
          </button>
        </div>

        <div className={styles.options}>
          {activeTab === 'heroes' && (
            <>
              {/* Hero Selection */}
              <div className={styles.optionGroup}>
                <label>Select Hero</label>
            <div className={styles.heroGrid}>
              {HERO_OPTIONS.map((heroOption) => (
                <button
                  key={heroOption.id}
                  className={`${styles.heroCard} ${
                    isHeroSelected(heroOption.id) ? styles.active : ''
                  }`}
                  onClick={() => handleHeroSelect(heroOption)}
                  title={isItemOwned(heroOption.id) ? 'Owned' : heroOption.cost === 0 ? 'Free' : `${heroOption.cost} coins`}
                >
                  <div className={styles.heroImageWrapper}>
                    {heroOption.cropWidth !== undefined ? (
                      <div 
                        className={styles.croppedThumbnail}
                        style={{
                          backgroundImage: `url(${heroOption.image})`,
                          backgroundSize: `${100 / (heroOption.cropWidth! / 100)}% ${100 / ((heroOption.cropHeight || 100) / 100)}%`,
                          backgroundPosition: `${heroOption.cropX || 0}% ${heroOption.cropY || 0}%`,
                          backgroundRepeat: 'no-repeat',
                          aspectRatio: `${heroOption.cropWidth} / ${heroOption.cropHeight || 100}`
                        }}
                      />
                    ) : (
                      <Image
                        src={heroOption.image}
                        alt={heroOption.name}
                        width={120}
                        height={168}
                        className={styles.heroThumbnail}
                      />
                    )}
                    {isItemOwned(heroOption.id) && (
                      <span className={styles.ownedBadge}>✓</span>
                    )}
                    {!isItemOwned(heroOption.id) && heroOption.cost > 0 && (
                      <span className={styles.costBadge}>
                        {heroOption.cost}💎
                      </span>
                    )}
                  </div>
                  <p className={styles.heroName}>{heroOption.name}</p>
                  {heroOption.description && (
                    <p className={styles.heroDescription}>{heroOption.description}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className={styles.optionGroup}>
            <label>Accessories</label>
            <div className={styles.accessoryGrid}>
              {ACCESSORIES.map((accessory) => (
                <button
                  key={accessory.id}
                  className={`${styles.accessoryButton} ${
                    isAccessoryActive(accessory.id) ? styles.active : ''
                  } ${!canAfford(accessory.cost, accessory.id) && accessory.cost > 0 ? styles.disabled : ''}`}
                  onClick={() => handleAccessoryToggle(accessory)}
                  disabled={!canAfford(accessory.cost, accessory.id) && accessory.cost > 0}
                  title={isItemOwned(accessory.id) ? 'Owned - Click to toggle' : accessory.cost === 0 ? 'Free' : `${accessory.cost} coins`}
                >
                  <span className={styles.accessoryIcon}>{accessory.image}</span>
                  <span className={styles.accessoryName}>{accessory.name}</span>
                  {isItemOwned(accessory.id) ? (
                    <span className={styles.ownedText}>Owned</span>
                  ) : accessory.cost > 0 ? (
                    <span className={styles.costText}>{accessory.cost}💎</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
            </>
          )}

          {activeTab === 'icon' && (
            <>
              {/* Eyes */}
              <div className={styles.optionGroup}>
                <label>Eyes</label>
                <div className={styles.iconGrid}>
                  {EYES_OPTIONS.map((element) => (
                    <button
                      key={element.id}
                      className={`${styles.iconButton} ${
                        isIconElementSelected(element.id, 'eyes') ? styles.active : ''
                      } ${!canAfford(element.cost, element.id) && element.cost > 0 ? styles.disabled : ''}`}
                      onClick={() => handleIconElementSelect(element)}
                      disabled={!canAfford(element.cost, element.id) && element.cost > 0}
                      title={isItemOwned(element.id) ? 'Owned' : element.cost === 0 ? 'Free' : `${element.cost} coins`}
                    >
                      <span className={styles.iconEmoji}>{element.emoji}</span>
                      <span className={styles.iconName}>{element.name}</span>
                      {isItemOwned(element.id) ? (
                        <span className={styles.ownedText}>Owned</span>
                      ) : element.cost > 0 ? (
                        <span className={styles.costText}>{element.cost}💎</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mouth */}
              <div className={styles.optionGroup}>
                <label>Mouth</label>
                <div className={styles.iconGrid}>
                  {MOUTH_OPTIONS.map((element) => (
                    <button
                      key={element.id}
                      className={`${styles.iconButton} ${
                        isIconElementSelected(element.id, 'mouth') ? styles.active : ''
                      } ${!canAfford(element.cost, element.id) && element.cost > 0 ? styles.disabled : ''}`}
                      onClick={() => handleIconElementSelect(element)}
                      disabled={!canAfford(element.cost, element.id) && element.cost > 0}
                      title={isItemOwned(element.id) ? 'Owned' : element.cost === 0 ? 'Free' : `${element.cost} coins`}
                    >
                      <span className={styles.iconEmoji}>{element.emoji}</span>
                      <span className={styles.iconName}>{element.name}</span>
                      {isItemOwned(element.id) ? (
                        <span className={styles.ownedText}>Owned</span>
                      ) : element.cost > 0 ? (
                        <span className={styles.costText}>{element.cost}💎</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories */}
              <div className={styles.optionGroup}>
                <label>Icon Accessories</label>
                <div className={styles.iconGrid}>
                  {ACCESSORY_OPTIONS.map((element) => (
                    <button
                      key={element.id}
                      className={`${styles.iconButton} ${
                        isIconElementSelected(element.id, 'accessory') ? styles.active : ''
                      } ${!canAfford(element.cost, element.id) && element.cost > 0 ? styles.disabled : ''}`}
                      onClick={() => handleIconElementSelect(element)}
                      disabled={!canAfford(element.cost, element.id) && element.cost > 0}
                      title={isItemOwned(element.id) ? 'Owned' : element.cost === 0 ? 'Free' : `${element.cost} coins`}
                    >
                      <span className={styles.iconEmoji}>{element.emoji || 'None'}</span>
                      <span className={styles.iconName}>{element.name}</span>
                      {isItemOwned(element.id) ? (
                        <span className={styles.ownedText}>Owned</span>
                      ) : element.cost > 0 ? (
                        <span className={styles.costText}>{element.cost}💎</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background */}
              <div className={styles.optionGroup}>
                <label>Background</label>
                <div className={styles.iconGrid}>
                  {BACKGROUND_OPTIONS.map((element) => (
                    <button
                      key={element.id}
                      className={`${styles.iconButton} ${
                        isIconElementSelected(element.id, 'background') ? styles.active : ''
                      } ${!canAfford(element.cost, element.id) && element.cost > 0 ? styles.disabled : ''}`}
                      onClick={() => handleIconElementSelect(element)}
                      disabled={!canAfford(element.cost, element.id) && element.cost > 0}
                      title={isItemOwned(element.id) ? 'Owned' : element.cost === 0 ? 'Free' : `${element.cost} coins`}
                    >
                      <span className={styles.iconEmoji}>{element.emoji}</span>
                      <span className={styles.iconName}>{element.name}</span>
                      {isItemOwned(element.id) ? (
                        <span className={styles.ownedText}>Owned</span>
                      ) : element.cost > 0 ? (
                        <span className={styles.costText}>{element.cost}💎</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
