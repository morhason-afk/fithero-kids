'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Hero } from '@/types/hero'
import { getInitialHero, applyTimeDecay, addCoinsToHero, addXpToHero, EXPERIENCE_PER_LEVEL } from '@/utils/heroUtils'
import { useConfig } from '@/contexts/ConfigContext'
import { DEFAULT_SKIN_ID, DEFAULT_OUTFIT_ID, DEFAULT_ACCESSORY_ID, DEFAULT_EXPRESSION_ID } from '@/data/characterOptions'

interface HeroContextType {
  hero: Hero
  addCoins: (coins: number) => void
  addXp: (xp: number) => void
  spendCoins: (coins: number) => boolean // Returns true if successful
  updateCosmetics: (cosmetics: Partial<Hero['cosmetics']>) => void
  addOwnedItem: (itemId: string) => void
  isItemOwned: (itemId: string) => boolean
  refreshHero: () => void
}

const HeroContext = createContext<HeroContextType | undefined>(undefined)

const STORAGE_KEY = 'exercise-game-hero'

function loadHeroFromStorage(initialCoins: number): Hero {
  if (typeof window === 'undefined') return getInitialHero(initialCoins)
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return getInitialHero(initialCoins)
    const parsed = JSON.parse(stored)
    if (!parsed?.stats?.level) return getInitialHero(initialCoins)

    // Ensure characterBuild exists (migrate from old selectedHeroId / image heroes)
    if (!parsed.cosmetics.characterBuild) {
      parsed.cosmetics.characterBuild = {
        skinId: DEFAULT_SKIN_ID,
        outfitId: DEFAULT_OUTFIT_ID,
        accessoryIds: [DEFAULT_ACCESSORY_ID],
        expressionId: DEFAULT_EXPRESSION_ID,
      }
      if (!parsed.ownedItems) parsed.ownedItems = []
      const defaults = [DEFAULT_SKIN_ID, DEFAULT_OUTFIT_ID, DEFAULT_ACCESSORY_ID]
      defaults.forEach(id => { if (!parsed.ownedItems.includes(id)) parsed.ownedItems.push(id) })
    }

    // Ensure iconCustomization exists
    if (!parsed.cosmetics.iconCustomization) {
      parsed.cosmetics.iconCustomization = {
        eyes: 'eyes-default',
        mouth: 'mouth-smile',
        accessory: 'acc-none',
        background: 'bg-default'
      }
      if (!parsed.ownedItems) parsed.ownedItems = []
      ;['eyes-default', 'mouth-smile', 'acc-none', 'bg-default'].forEach(id => {
        if (!parsed.ownedItems.includes(id)) parsed.ownedItems.push(id)
      })
    }

    if (!parsed.ownedItems || !Array.isArray(parsed.ownedItems)) {
      parsed.ownedItems = [DEFAULT_SKIN_ID, DEFAULT_OUTFIT_ID, DEFAULT_ACCESSORY_ID]
    }
    if (!parsed.cosmetics.characterBuild.accessoryIds) {
      parsed.cosmetics.characterBuild.accessoryIds = [DEFAULT_ACCESSORY_ID]
    }
    if (!parsed.cosmetics.characterBuild.expressionId) {
      parsed.cosmetics.characterBuild.expressionId = DEFAULT_EXPRESSION_ID
    }

    // Normalize XP/level: 20 XP per level; if experience missing, derive from stored level
    if (typeof parsed.stats.experience !== 'number') {
      parsed.stats.experience = Math.max(0, ((parsed.stats.level ?? 1) - 1) * EXPERIENCE_PER_LEVEL)
    }
    if (typeof parsed.stats.experienceToNextLevel !== 'number') {
      parsed.stats.experienceToNextLevel = EXPERIENCE_PER_LEVEL
    }

    return applyTimeDecay(parsed)
  } catch {
    return getInitialHero(initialCoins)
  }
}

export function HeroProvider({ children }: { children: ReactNode }) {
  const { initialCoins, config } = useConfig()
  const [hero, setHero] = useState<Hero>(() => getInitialHero(initialCoins))

  // Load from localStorage after mount (client-only). Use initialCoins when no saved hero.
  useEffect(() => {
    setHero(loadHeroFromStorage(initialCoins))
  }, [initialCoins])

  // Save to localStorage whenever hero changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hero))
    }
  }, [hero])

  // Apply decay check periodically (every hour)
  useEffect(() => {
    const interval = setInterval(() => {
      setHero(prev => applyTimeDecay(prev))
    }, 60 * 60 * 1000) // Check every hour

    return () => clearInterval(interval)
  }, [])

  const addCoins = (coins: number) => {
    setHero(prev => addCoinsToHero(prev, coins))
  }

  const addXp = (xp: number) => {
    const perLevel = typeof config.experiencePerLevel === 'number' && config.experiencePerLevel >= 1
      ? config.experiencePerLevel
      : EXPERIENCE_PER_LEVEL
    setHero(prev => addXpToHero(prev, xp, perLevel))
  }

  const spendCoins = (coins: number): boolean => {
    if (hero.stats.totalCoins >= coins) {
      setHero(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalCoins: prev.stats.totalCoins - coins
        }
      }))
      return true
    }
    return false
  }

  const updateCosmetics = (cosmetics: Partial<Hero['cosmetics']>) => {
    setHero(prev => ({
      ...prev,
      cosmetics: { ...prev.cosmetics, ...cosmetics }
    }))
  }

  const addOwnedItem = (itemId: string) => {
    setHero(prev => {
      if (prev.ownedItems.includes(itemId)) {
        return prev // Already owned
      }
      return {
        ...prev,
        ownedItems: [...prev.ownedItems, itemId]
      }
    })
  }

  const isItemOwned = (itemId: string): boolean => {
    return hero.ownedItems.includes(itemId)
  }

  const refreshHero = () => {
    setHero(prev => applyTimeDecay(prev))
  }

  return (
    <HeroContext.Provider value={{ hero, addCoins, addXp, spendCoins, updateCosmetics, addOwnedItem, isItemOwned, refreshHero }}>
      {children}
    </HeroContext.Provider>
  )
}

export function useHero() {
  const context = useContext(HeroContext)
  if (context === undefined) {
    throw new Error('useHero must be used within a HeroProvider')
  }
  return context
}
