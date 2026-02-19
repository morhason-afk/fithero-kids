export interface HeroOption {
  id: string
  name: string
  image: string
  cost: number // 0 = free/default
  description?: string
  // For multi-hero images, specify crop area
  cropX?: number // percentage (0-100)
  cropY?: number // percentage (0-100)
  cropWidth?: number // percentage (0-100)
  cropHeight?: number // percentage (0-100)
}

// Hero images - starting with one hero, adding more one by one
export const HERO_OPTIONS: HeroOption[] = [
  {
    id: 'superman-hero',
    name: 'Superman Hero',
    image: '/heroes/superman-hero.png',
    cost: 0, // Default/free
    description: 'Classic superhero with red cape'
    // No cropping needed - this is a standalone image
  },
  {
    id: 'purple-heroine',
    name: 'Purple Heroine',
    image: '/heroes/purple-heroine.png',
    cost: 50,
    description: 'Teal armored heroine with purple hair'
    // No cropping needed - this is a standalone image
  },
  {
    id: 'dark-purple-heroine',
    name: 'Dark Purple Heroine',
    image: '/heroes/dark-purple-heroine.png',
    cost: 50,
    description: 'Teal suit heroine with wavy purple hair'
    // No cropping needed - this is a standalone image
  },
  {
    id: 'green-speedster',
    name: 'Green Speedster',
    image: '/heroes/green-speedster.png',
    cost: 50,
    description: 'Energetic speedster with green spiky hair'
    // No cropping needed - this is a standalone image
  },
  {
    id: 'barbarian-warrior',
    name: 'Barbarian Warrior',
    image: '/heroes/barbarian-warrior.png',
    cost: 75,
    description: 'Powerful barbarian with fur tunic',
    cropX: 3,
    cropY: 8,
    cropWidth: 94,
    cropHeight: 92
  },
  {
    id: 'caped-barbarian',
    name: 'Caped Barbarian',
    image: '/heroes/caped-barbarian.png',
    cost: 75,
    description: 'Barbarian hero with blue top and cape'
    // No cropping needed - this is a standalone image
  },
  {
    id: 'pink-speedster',
    name: 'Pink Speedster',
    image: '/heroes/pink-speedster.png',
    cost: 75,
    description: 'Dynamic speedster with pink curly hair'
    // No cropping needed - this is a standalone image
  },
  {
    id: 'scientist-mage',
    name: 'Scientist Mage',
    image: '/heroes/scientist-mage.png',
    cost: 100,
    description: 'Smart hero with glasses and energy orb'
    // No cropping needed - this is a standalone image
  },
  {
    id: 'white-armored-hero',
    name: 'White Armored Hero',
    image: '/heroes/white-armored-hero.png',
    cost: 100,
    description: 'Sleek silver and purple armored suit'
    // No cropping needed - this is a standalone image
  },
  {
    id: 'stealth-hero',
    name: 'Stealth Hero',
    image: '/heroes/stealth-hero.png',
    cost: 100,
    description: 'Dark stealth hero with purple glow'
    // No cropping needed - this is a standalone image
  },
  {
    id: 'bee-gadgeteer',
    name: 'Bee Gadgeteer',
    image: '/heroes/bee-gadgeteer.png',
    cost: 125,
    description: 'Tactical bee-themed hero'
    // No cropping needed - this is a standalone image
  },
  {
    id: 'bee-child',
    name: 'Happy Bee Child',
    image: '/heroes/bee-child.png',
    cost: 150,
    description: 'Joyful bee child with wings'
    // No cropping needed - this is a standalone image
  }
]

export const ACCESSORIES: HeroOption[] = [
  {
    id: 'crown',
    name: 'Crown',
    image: '👑',
    cost: 30,
    description: 'Golden crown accessory'
  },
  {
    id: 'cape',
    name: 'Cape',
    image: '🦸',
    cost: 25,
    description: 'Hero cape'
  },
  {
    id: 'gloves',
    name: 'Gloves',
    image: '🥊',
    cost: 20,
    description: 'Power gloves'
  }
]

export function getHeroById(id: string): HeroOption | undefined {
  return HERO_OPTIONS.find(hero => hero.id === id)
}

export function getDefaultHero(): HeroOption {
  return HERO_OPTIONS[0] // Superman hero is default
}
