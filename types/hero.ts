export interface HeroStats {
  level: number
  experience: number
  experienceToNextLevel: number
  health: number // 0-100
  strength: number // 0-100
  totalCoins: number
  lastExerciseDate: number // timestamp
}

export interface HeroCosmetics {
  selectedHeroId: string // ID of the selected hero image
  accessories: string[] // e.g., ['crown', 'cape', 'gloves']
  iconCustomization: {
    eyes: string // Icon element ID
    mouth: string // Icon element ID
    accessory: string // Icon element ID (can be empty)
    background: string // Icon element ID
  }
}

export interface Hero {
  stats: HeroStats
  cosmetics: HeroCosmetics
  ownedItems: string[] // IDs of owned heroes and accessories
}
