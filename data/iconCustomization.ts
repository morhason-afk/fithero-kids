export interface IconElement {
  id: string
  name: string
  emoji: string // Simple emoji representation
  cost: number // 0 = free
  category: 'eyes' | 'mouth' | 'accessory' | 'background'
  description?: string
}

// Eyes options – display as composable parts on a single face (not full-face emoji)
export const EYES_OPTIONS: IconElement[] = [
  { id: 'eyes-default', name: 'Default', emoji: '• •', cost: 0, category: 'eyes', description: 'Simple dots' },
  { id: 'eyes-wink', name: 'Wink', emoji: '• ˘', cost: 0, category: 'eyes', description: 'One eye winking' },
  { id: 'eyes-star', name: 'Stars', emoji: '★ ★', cost: 10, category: 'eyes', description: 'Sparkling stars' },
  { id: 'eyes-heart', name: 'Hearts', emoji: '♥ ♥', cost: 15, category: 'eyes', description: 'Heart eyes' },
  { id: 'eyes-sleepy', name: 'Sleepy', emoji: '﹏ ﹏', cost: 12, category: 'eyes', description: 'Half-closed' },
  { id: 'eyes-cool', name: 'Cool', emoji: '◠ ◠', cost: 20, category: 'eyes', description: 'Cool curved' },
  { id: 'eyes-fire', name: 'Wide', emoji: '◉ ◉', cost: 25, category: 'eyes', description: 'Wide awake' },
  { id: 'eyes-robot', name: 'Robot', emoji: '□ □', cost: 22, category: 'eyes', description: 'Robot style' },
  { id: 'eyes-sparkle', name: 'Sparkle', emoji: '✦ ✦', cost: 30, category: 'eyes', description: 'Sparkly' },
]

// Mouth options – display as composable parts on a single face
export const MOUTH_OPTIONS: IconElement[] = [
  { id: 'mouth-smile', name: 'Smile', emoji: '︶', cost: 0, category: 'mouth', description: 'Happy smile' },
  { id: 'mouth-big-smile', name: 'Big Smile', emoji: '︵', cost: 0, category: 'mouth', description: 'Big smile' },
  { id: 'mouth-smirk', name: 'Smirk', emoji: '︿', cost: 8, category: 'mouth', description: 'Cool smirk' },
  { id: 'mouth-tongue', name: 'Tongue', emoji: 'ω', cost: 12, category: 'mouth', description: 'Playful' },
  { id: 'mouth-kiss', name: 'Kiss', emoji: '﹏', cost: 15, category: 'mouth', description: 'Kiss face' },
  { id: 'mouth-surprised', name: 'Surprised', emoji: '○', cost: 18, category: 'mouth', description: 'Surprised O' },
  { id: 'mouth-woo', name: 'Wow', emoji: '〇', cost: 15, category: 'mouth', description: 'Wow!' },
  { id: 'mouth-laugh', name: 'Laugh', emoji: '▂', cost: 22, category: 'mouth', description: 'Big laugh' },
  { id: 'mouth-cat', name: 'Cat', emoji: 'ω', cost: 25, category: 'mouth', description: 'Cat mouth' },
]

// Accessory options (hats, glasses, etc.)
export const ACCESSORY_OPTIONS: IconElement[] = [
  { id: 'acc-none', name: 'None', emoji: '', cost: 0, category: 'accessory', description: 'No accessory' },
  { id: 'acc-cap', name: 'Cap', emoji: '🧢', cost: 10, category: 'accessory', description: 'Cool cap' },
  { id: 'acc-party', name: 'Party', emoji: '🎉', cost: 15, category: 'accessory', description: 'Party hat' },
  { id: 'acc-bow', name: 'Bow', emoji: '🎀', cost: 12, category: 'accessory', description: 'Cute bow' },
  { id: 'acc-crown', name: 'Crown', emoji: '👑', cost: 25, category: 'accessory', description: 'Royal crown' },
  { id: 'acc-glasses', name: 'Glasses', emoji: '🤓', cost: 18, category: 'accessory', description: 'Smart glasses' },
  { id: 'acc-star', name: 'Star', emoji: '⭐', cost: 20, category: 'accessory', description: 'Star on head' },
  { id: 'acc-headphones', name: 'Phones', emoji: '🎧', cost: 28, category: 'accessory', description: 'Headphones' },
  { id: 'acc-halo', name: 'Halo', emoji: '😇', cost: 32, category: 'accessory', description: 'Angel halo' },
]

// Background/Frame options
export const BACKGROUND_OPTIONS: IconElement[] = [
  { id: 'bg-default', name: 'Default', emoji: '⚪', cost: 0, category: 'background', description: 'Simple background' },
  { id: 'bg-star', name: 'Stars', emoji: '⭐', cost: 12, category: 'background', description: 'Starry frame' },
  { id: 'bg-heart', name: 'Hearts', emoji: '💖', cost: 15, category: 'background', description: 'Heart frame' },
  { id: 'bg-sun', name: 'Sun', emoji: '☀️', cost: 14, category: 'background', description: 'Sunny' },
  { id: 'bg-moon', name: 'Moon', emoji: '🌙', cost: 18, category: 'background', description: 'Night sky' },
  { id: 'bg-rainbow', name: 'Rainbow', emoji: '🌈', cost: 22, category: 'background', description: 'Rainbow' },
  { id: 'bg-fire', name: 'Fire', emoji: '🔥', cost: 25, category: 'background', description: 'Fire frame' },
  { id: 'bg-sparkle', name: 'Sparkle', emoji: '✨', cost: 28, category: 'background', description: 'Sparkly' },
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
