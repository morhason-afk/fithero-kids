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
  type: 'cape' | 'crown' | 'belt' | 'gloves' | 'wings'
  cost: number
  color?: string
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
]

export const CHARACTER_ACCESSORIES: CharacterAccessoryOption[] = [
  { id: 'acc-none', name: 'None', type: 'cape', cost: 0 },
  { id: 'acc-cape', name: 'Cape', type: 'cape', cost: 15, color: '#B71C1C' },
  { id: 'acc-belt', name: 'Belt', type: 'belt', cost: 10, color: '#5D4037' },
  { id: 'acc-gloves', name: 'Gloves', type: 'gloves', cost: 12, color: '#FFF' },
  { id: 'acc-crown', name: 'Crown', type: 'crown', cost: 25, color: '#FFD700' },
  { id: 'acc-wings', name: 'Wings', type: 'wings', cost: 35, color: '#B0BEC5' },
  { id: 'acc-scarf', name: 'Scarf', type: 'cape', cost: 18, color: '#E91E63' },
  { id: 'acc-shield', name: 'Shield', type: 'belt', cost: 40, color: '#607D8B' },
]

export const DEFAULT_SKIN_ID = 'skin-default'
export const DEFAULT_OUTFIT_ID = 'outfit-red'
export const DEFAULT_ACCESSORY_ID = 'acc-none'

export function getSkinById(id: string): SkinOption | undefined {
  return SKIN_OPTIONS.find(s => s.id === id)
}

export function getOutfitById(id: string): OutfitOption | undefined {
  return OUTFIT_OPTIONS.find(o => o.id === id)
}

export function getCharacterAccessoryById(id: string): CharacterAccessoryOption | undefined {
  return CHARACTER_ACCESSORIES.find(a => a.id === id)
}
