/**
 * Scalable full-body character options.
 * Easy to add new skins, outfits, and accessories without new assets.
 */

export interface SkinOption {
  id: string
  name: string
  color: string // hex
  cost: number
}

export interface OutfitOption {
  id: string
  name: string
  bodyColor: string
  legColor: string
  cost: number
}

export interface CharacterAccessoryOption {
  id: string
  name: string
  type: 'cape' | 'crown' | 'belt' | 'gloves' | 'wings' | 'scarf' | 'shield' | 'halo' | 'mask' | 'backpack'
  cost: number
  color?: string
}

export interface FaceExpressionOption {
  id: string
  name: string
  cost: number
  /** eyes: 'default' | 'happy' | 'sad' | 'surprised' | 'stars' | 'hearts' | 'wink' | 'angry' | 'sleepy' */
  eyes: string
  /** mouth: 'smile' | 'frown' | 'open' | 'neutral' | 'tongue' | 'bigSmile' */
  mouth: string
}

export const SKIN_OPTIONS: SkinOption[] = [
  { id: 'skin-default', name: 'Classic', color: '#FFDBAC', cost: 0 },
  { id: 'skin-tan', name: 'Tan', color: '#E8C4A0', cost: 0 },
  { id: 'skin-warm', name: 'Warm', color: '#D4A574', cost: 10 },
  { id: 'skin-cool', name: 'Cool', color: '#C9A87C', cost: 10 },
  { id: 'skin-pale', name: 'Light', color: '#F5D0B0', cost: 15 },
  { id: 'skin-deep', name: 'Deep', color: '#8D5524', cost: 25 },
  { id: 'skin-bronze', name: 'Bronze', color: '#CD7F32', cost: 20 },
  { id: 'skin-mocha', name: 'Mocha', color: '#967259', cost: 30 },
]

export const OUTFIT_OPTIONS: OutfitOption[] = [
  { id: 'outfit-red', name: 'Red', bodyColor: '#E53935', legColor: '#1A237E', cost: 0 },
  { id: 'outfit-blue', name: 'Blue', bodyColor: '#1E88E5', legColor: '#0D47A1', cost: 0 },
  { id: 'outfit-green', name: 'Green', bodyColor: '#43A047', legColor: '#1B5E20', cost: 0 },
  { id: 'outfit-purple', name: 'Purple', bodyColor: '#8E24AA', legColor: '#4A148C', cost: 0 },
  { id: 'outfit-yellow', name: 'Yellow', bodyColor: '#FDD835', legColor: '#F9A825', cost: 0 },
  { id: 'outfit-orange', name: 'Orange', bodyColor: '#FB8C00', legColor: '#E65100', cost: 15 },
  { id: 'outfit-pink', name: 'Pink', bodyColor: '#EC407A', legColor: '#AD1457', cost: 20 },
  { id: 'outfit-cyan', name: 'Cyan', bodyColor: '#00ACC1', legColor: '#006064', cost: 20 },
  { id: 'outfit-gold', name: 'Gold', bodyColor: '#FFD700', legColor: '#FFA500', cost: 30 },
  { id: 'outfit-teal', name: 'Teal', bodyColor: '#00897B', legColor: '#004D40', cost: 25 },
  { id: 'outfit-navy', name: 'Navy', bodyColor: '#1565C0', legColor: '#0D47A1', cost: 0 },
  { id: 'outfit-lime', name: 'Lime', bodyColor: '#9E9D24', legColor: '#558B2F', cost: 10 },
  { id: 'outfit-coral', name: 'Coral', bodyColor: '#FF7043', legColor: '#BF360C', cost: 18 },
  { id: 'outfit-mint', name: 'Mint', bodyColor: '#4DB6AC', legColor: '#00695C', cost: 15 },
  { id: 'outfit-lavender', name: 'Lavender', bodyColor: '#B39DDB', legColor: '#512DA8', cost: 22 },
  { id: 'outfit-maroon', name: 'Maroon', bodyColor: '#AD1457', legColor: '#4A148C', cost: 28 },
  { id: 'outfit-silver', name: 'Silver', bodyColor: '#90A4AE', legColor: '#455A64', cost: 35 },
  { id: 'outfit-rainbow', name: 'Rainbow', bodyColor: '#E91E63', legColor: '#3F51B5', cost: 40 },
  { id: 'outfit-camo', name: 'Camo', bodyColor: '#5D4037', legColor: '#33691E', cost: 25 },
  { id: 'outfit-sunset', name: 'Sunset', bodyColor: '#FF5722', legColor: '#E64A19', cost: 30 },
]

export const CHARACTER_ACCESSORIES: CharacterAccessoryOption[] = [
  { id: 'acc-none', name: 'None', type: 'cape', cost: 0 },
  { id: 'acc-cape', name: 'Cape', type: 'cape', cost: 15, color: '#B71C1C' },
  { id: 'acc-belt', name: 'Belt', type: 'belt', cost: 10, color: '#5D4037' },
  { id: 'acc-gloves', name: 'Gloves', type: 'gloves', cost: 12, color: '#FFF' },
  { id: 'acc-crown', name: 'Crown', type: 'crown', cost: 25, color: '#FFD700' },
  { id: 'acc-wings', name: 'Wings', type: 'wings', cost: 35, color: '#B0BEC5' },
  { id: 'acc-scarf', name: 'Scarf', type: 'scarf', cost: 18, color: '#E91E63' },
  { id: 'acc-shield', name: 'Shield', type: 'shield', cost: 40, color: '#607D8B' },
  { id: 'acc-cape-blue', name: 'Blue Cape', type: 'cape', cost: 20, color: '#1565C0' },
  { id: 'acc-cape-gold', name: 'Gold Cape', type: 'cape', cost: 28, color: '#FFD700' },
  { id: 'acc-halo', name: 'Halo', type: 'halo', cost: 30, color: '#FFF59D' },
  { id: 'acc-mask-hero', name: 'Hero Mask', type: 'mask', cost: 22, color: '#37474F' },
  { id: 'acc-backpack', name: 'Backpack', type: 'backpack', cost: 15, color: '#795548' },
  { id: 'acc-wings-angel', name: 'Angel Wings', type: 'wings', cost: 45, color: '#ECEFF1' },
  { id: 'acc-belt-gold', name: 'Gold Belt', type: 'belt', cost: 20, color: '#FFB300' },
  { id: 'acc-gloves-red', name: 'Red Gloves', type: 'gloves', cost: 18, color: '#D32F2F' },
  { id: 'acc-scarf-stripe', name: 'Striped Scarf', type: 'scarf', cost: 25, color: '#FF9800' },
]

export const FACE_EXPRESSIONS: FaceExpressionOption[] = [
  { id: 'face-happy', name: 'Happy', cost: 0, eyes: 'happy', mouth: 'smile' },
  { id: 'face-default', name: 'Calm', cost: 0, eyes: 'default', mouth: 'neutral' },
  { id: 'face-surprised', name: 'Surprised', cost: 0, eyes: 'surprised', mouth: 'open' },
  { id: 'face-sad', name: 'Sad', cost: 0, eyes: 'sad', mouth: 'frown' },
  { id: 'face-stars', name: 'Star Eyes', cost: 10, eyes: 'stars', mouth: 'smile' },
  { id: 'face-hearts', name: 'Hearts', cost: 12, eyes: 'hearts', mouth: 'bigSmile' },
  { id: 'face-wink', name: 'Wink', cost: 0, eyes: 'wink', mouth: 'smile' },
  { id: 'face-angry', name: 'Determined', cost: 5, eyes: 'angry', mouth: 'frown' },
  { id: 'face-sleepy', name: 'Sleepy', cost: 5, eyes: 'sleepy', mouth: 'neutral' },
  { id: 'face-tongue', name: 'Silly', cost: 8, eyes: 'happy', mouth: 'tongue' },
  { id: 'face-big-smile', name: 'Super Happy', cost: 10, eyes: 'happy', mouth: 'bigSmile' },
]

export const DEFAULT_SKIN_ID = 'skin-default'
export const DEFAULT_OUTFIT_ID = 'outfit-red'
export const DEFAULT_ACCESSORY_ID = 'acc-none'
export const DEFAULT_EXPRESSION_ID = 'face-happy'

export function getSkinById(id: string): SkinOption | undefined {
  return SKIN_OPTIONS.find(s => s.id === id)
}

export function getOutfitById(id: string): OutfitOption | undefined {
  return OUTFIT_OPTIONS.find(o => o.id === id)
}

export function getCharacterAccessoryById(id: string): CharacterAccessoryOption | undefined {
  return CHARACTER_ACCESSORIES.find(a => a.id === id)
}

export function getExpressionById(id: string): FaceExpressionOption | undefined {
  return FACE_EXPRESSIONS.find(e => e.id === id)
}
