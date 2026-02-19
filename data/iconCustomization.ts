export interface IconElement {
  id: string
  name: string
  emoji: string // Simple emoji representation
  cost: number // 0 = free
  category: 'eyes' | 'mouth' | 'accessory' | 'background'
  description?: string
}

// Eyes options
export const EYES_OPTIONS: IconElement[] = [
  { id: 'eyes-default', name: 'Default Eyes', emoji: '😊', cost: 0, category: 'eyes', description: 'Happy default eyes' },
  { id: 'eyes-wink', name: 'Winking', emoji: '😉', cost: 0, category: 'eyes', description: 'Playful wink' },
  { id: 'eyes-star', name: 'Star Eyes', emoji: '🤩', cost: 20, category: 'eyes', description: 'Sparkling star eyes' },
  { id: 'eyes-heart', name: 'Heart Eyes', emoji: '🥰', cost: 25, category: 'eyes', description: 'Loving heart eyes' },
  { id: 'eyes-cool', name: 'Cool Eyes', emoji: '😎', cost: 30, category: 'eyes', description: 'Cool sunglasses' },
  { id: 'eyes-fire', name: 'Fire Eyes', emoji: '🤯', cost: 40, category: 'eyes', description: 'Mind-blown eyes' },
]

// Mouth options
export const MOUTH_OPTIONS: IconElement[] = [
  { id: 'mouth-smile', name: 'Smile', emoji: '😊', cost: 0, category: 'mouth', description: 'Happy smile' },
  { id: 'mouth-big-smile', name: 'Big Smile', emoji: '😃', cost: 0, category: 'mouth', description: 'Big happy smile' },
  { id: 'mouth-tongue', name: 'Tongue Out', emoji: '😛', cost: 15, category: 'mouth', description: 'Playful tongue' },
  { id: 'mouth-kiss', name: 'Kiss', emoji: '😘', cost: 20, category: 'mouth', description: 'Sending kisses' },
  { id: 'mouth-surprised', name: 'Surprised', emoji: '😮', cost: 25, category: 'mouth', description: 'Surprised expression' },
  { id: 'mouth-laugh', name: 'Laughing', emoji: '😂', cost: 30, category: 'mouth', description: 'Laughing hard' },
]

// Accessory options (hats, glasses, etc.)
export const ACCESSORY_OPTIONS: IconElement[] = [
  { id: 'acc-none', name: 'No Accessory', emoji: '', cost: 0, category: 'accessory', description: 'No accessory' },
  { id: 'acc-crown', name: 'Crown', emoji: '👑', cost: 30, category: 'accessory', description: 'Royal crown' },
  { id: 'acc-party', name: 'Party Hat', emoji: '🎉', cost: 20, category: 'accessory', description: 'Celebration hat' },
  { id: 'acc-cap', name: 'Cap', emoji: '🧢', cost: 15, category: 'accessory', description: 'Cool cap' },
  { id: 'acc-glasses', name: 'Glasses', emoji: '🤓', cost: 25, category: 'accessory', description: 'Smart glasses' },
  { id: 'acc-headphones', name: 'Headphones', emoji: '🎧', cost: 35, category: 'accessory', description: 'Music headphones' },
]

// Background/Frame options
export const BACKGROUND_OPTIONS: IconElement[] = [
  { id: 'bg-default', name: 'Default', emoji: '⚪', cost: 0, category: 'background', description: 'Simple background' },
  { id: 'bg-star', name: 'Star Frame', emoji: '⭐', cost: 20, category: 'background', description: 'Starry frame' },
  { id: 'bg-heart', name: 'Heart Frame', emoji: '💖', cost: 25, category: 'background', description: 'Heart frame' },
  { id: 'bg-rainbow', name: 'Rainbow', emoji: '🌈', cost: 30, category: 'background', description: 'Rainbow background' },
  { id: 'bg-fire', name: 'Fire Frame', emoji: '🔥', cost: 35, category: 'background', description: 'Fire frame' },
]

export const ALL_ICON_ELEMENTS = [
  ...EYES_OPTIONS,
  ...MOUTH_OPTIONS,
  ...ACCESSORY_OPTIONS,
  ...BACKGROUND_OPTIONS,
]

export function getIconElementById(id: string): IconElement | undefined {
  return ALL_ICON_ELEMENTS.find(element => element.id === id)
}
