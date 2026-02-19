'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Hero } from '@/types/hero'
import { getInitialHero, applyTimeDecay, addCoinsToHero } from '@/utils/heroUtils'
import { useConfig } from '@/contexts/ConfigContext'

interface HeroContextType {
  hero: Hero
  addCoins: (coins: number) => void
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
    // Validate shape - check for new structure (selectedHeroId) or old structure (skinColor)
    const hasNewStructure = parsed?.cosmetics?.selectedHeroId
    const hasOldStructure = parsed?.cosmetics?.skinColor
    
    if (!parsed?.stats?.level || (!hasNewStructure && !hasOldStructure)) {
      return getInitialHero(initialCoins)
    }
    
    // Migrate from old structure to new structure if needed
    if (hasOldStructure && !hasNewStructure) {
      parsed.cosmetics = {
        selectedHeroId: 'superhero-green', // Default hero
        accessories: parsed.cosmetics.accessories || [],
        iconCustomization: {
          eyes: 'eyes-default',
          mouth: 'mouth-smile',
          accessory: 'acc-none',
          background: 'bg-default'
        }
      }
      parsed.ownedItems = parsed.ownedItems || ['superhero-green']
    }
    
    // Ensure iconCustomization exists
    if (!parsed.cosmetics.iconCustomization) {
      parsed.cosmetics.iconCustomization = {
        eyes: 'eyes-default',
        mouth: 'mouth-smile',
        accessory: 'acc-none',
        background: 'bg-default'
      }
      // Add default icon elements to ownedItems
      if (!parsed.ownedItems) parsed.ownedItems = []
      if (!parsed.ownedItems.includes('eyes-default')) parsed.ownedItems.push('eyes-default')
      if (!parsed.ownedItems.includes('mouth-smile')) parsed.ownedItems.push('mouth-smile')
      if (!parsed.ownedItems.includes('acc-none')) parsed.ownedItems.push('acc-none')
      if (!parsed.ownedItems.includes('bg-default')) parsed.ownedItems.push('bg-default')
    }
    
    // Ensure ownedItems exists
    if (!parsed.ownedItems || !Array.isArray(parsed.ownedItems)) {
      parsed.ownedItems = [parsed.cosmetics.selectedHeroId || 'superhero-green']
    }
    
    // Ensure accessories exists
    if (!parsed.cosmetics.accessories || !Array.isArray(parsed.cosmetics.accessories)) {
      parsed.cosmetics.accessories = []
    }
    
    return applyTimeDecay(parsed)
  } catch {
    return getInitialHero(initialCoins)
  }
}

export function HeroProvider({ children }: { children: ReactNode }) {
  const { initialCoins } = useConfig()
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
    <HeroContext.Provider value={{ hero, addCoins, spendCoins, updateCosmetics, addOwnedItem, isItemOwned, refreshHero }}>
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
