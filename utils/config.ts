import { AdminConfig } from '@/types/config'

const CONFIG_STORAGE_KEY = 'exercise-game-admin-config'

export function getDefaultConfig(): AdminConfig {
  return {
    challengeOrder: [],
    challengeDurations: {},
    initialCoins: 0,
  }
}

export function getConfig(): AdminConfig {
  if (typeof window === 'undefined') return getDefaultConfig()
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY)
    if (!raw) return getDefaultConfig()
    const parsed = JSON.parse(raw) as Partial<AdminConfig>
    return {
      challengeOrder: Array.isArray(parsed.challengeOrder) ? parsed.challengeOrder : [],
      challengeDurations: parsed.challengeDurations && typeof parsed.challengeDurations === 'object'
        ? parsed.challengeDurations
        : {},
      initialCoins: typeof parsed.initialCoins === 'number' && parsed.initialCoins >= 0
        ? parsed.initialCoins
        : 0,
    }
  } catch {
    return getDefaultConfig()
  }
}

export function setConfig(config: AdminConfig): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config))
}
