export interface HeroStats {
  level: number
  experience: number
  experienceToNextLevel: number
  health: number // 0-100
  strength: number // 0-100
  totalCoins: number
  lastExerciseDate: number // timestamp
}

export interface CharacterBuild {
  skinId: string
  outfitId: string
  accessoryIds: string[] // character accessories (cape, crown, etc.)
}

export interface HeroCosmetics {
  /** @deprecated Use characterBuild instead. Kept for migration. */
  selectedHeroId?: string
  /** Legacy hero accessories (emoji). Kept for migration. */
  accessories?: string[]
  characterBuild: CharacterBuild
  iconCustomization: {
    eyes: string
    mouth: string
    accessory: string
    background: string
  }
}

export interface Hero {
  stats: HeroStats
  cosmetics: HeroCosmetics
  ownedItems: string[] // IDs of owned heroes and accessories
}
