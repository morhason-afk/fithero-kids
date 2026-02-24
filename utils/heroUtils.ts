import { HeroStats, Hero } from '@/types/hero'
import { DEFAULT_SKIN_ID, DEFAULT_OUTFIT_ID, DEFAULT_ACCESSORY_ID } from '@/data/characterOptions'

const EXPERIENCE_PER_LEVEL = 100
const DECAY_HOURS = 48 // Hero starts decaying after 48 hours of inactivity
const DECAY_RATE = 0.1 // Lose 10% of level per day after decay period

export function calculateLevelFromExperience(experience: number): number {
  return Math.floor(experience / EXPERIENCE_PER_LEVEL) + 1
}

export function calculateExperienceToNextLevel(experience: number): number {
  const currentLevel = calculateLevelFromExperience(experience)
  const experienceForCurrentLevel = (currentLevel - 1) * EXPERIENCE_PER_LEVEL
  return currentLevel * EXPERIENCE_PER_LEVEL - experienceForCurrentLevel
}

export function calculateHealthFromLevel(level: number): number {
  // Health increases with level, capped at 100
  return Math.min(100, 50 + level * 5)
}

export function calculateStrengthFromLevel(level: number): number {
  // Strength increases with level, capped at 100
  return Math.min(100, 30 + level * 7)
}

export function addCoinsToHero(hero: Hero, coins: number): Hero {
  const newExperience = hero.stats.experience + coins
  const newLevel = calculateLevelFromExperience(newExperience)
  const newHealth = calculateHealthFromLevel(newLevel)
  const newStrength = calculateStrengthFromLevel(newLevel)
  
  return {
    ...hero,
    stats: {
      ...hero.stats,
      experience: newExperience,
      level: newLevel,
      experienceToNextLevel: calculateExperienceToNextLevel(newExperience),
      health: newHealth,
      strength: newStrength,
      totalCoins: hero.stats.totalCoins + coins,
      lastExerciseDate: Date.now()
    }
  }
}

export function applyTimeDecay(hero: Hero): Hero {
  const now = Date.now()
  const hoursSinceLastExercise = (now - hero.stats.lastExerciseDate) / (1000 * 60 * 60)
  
  // No decay if exercised within DECAY_HOURS
  if (hoursSinceLastExercise < DECAY_HOURS) {
    return hero
  }
  
  // Calculate decay: lose levels based on days inactive
  const daysInactive = (hoursSinceLastExercise - DECAY_HOURS) / 24
  const levelsToLose = Math.floor(daysInactive * DECAY_RATE)
  
  if (levelsToLose <= 0) {
    return hero
  }
  
  const newLevel = Math.max(1, hero.stats.level - levelsToLose)
  const newExperience = (newLevel - 1) * EXPERIENCE_PER_LEVEL
  
  return {
    ...hero,
    stats: {
      ...hero.stats,
      level: newLevel,
      experience: newExperience,
      experienceToNextLevel: calculateExperienceToNextLevel(newExperience),
      health: calculateHealthFromLevel(newLevel),
      strength: calculateStrengthFromLevel(newLevel)
    }
  }
}

export function getInitialHero(initialCoins: number = 0): Hero {
  return {
    stats: {
      level: 1,
      experience: 0,
      experienceToNextLevel: EXPERIENCE_PER_LEVEL,
      health: calculateHealthFromLevel(1),
      strength: calculateStrengthFromLevel(1),
      totalCoins: Math.max(0, initialCoins),
      lastExerciseDate: Date.now()
    },
    cosmetics: {
      characterBuild: {
        skinId: DEFAULT_SKIN_ID,
        outfitId: DEFAULT_OUTFIT_ID,
        accessoryIds: [DEFAULT_ACCESSORY_ID],
      },
      iconCustomization: {
        eyes: 'eyes-default',
        mouth: 'mouth-smile',
        accessory: 'acc-none',
        background: 'bg-default'
      }
    },
    ownedItems: [
      DEFAULT_SKIN_ID,
      DEFAULT_OUTFIT_ID,
      DEFAULT_ACCESSORY_ID,
      'eyes-default',
      'mouth-smile',
      'acc-none',
      'bg-default'
    ]
  }
}
