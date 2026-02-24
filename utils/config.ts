import { AdminConfig } from '@/types/config'

const CONFIG_STORAGE_KEY = 'exercise-game-admin-config'

const DEFAULT_MIN_STARS = 2
const DEFAULT_SUBSCRIPTION_USD = 4.99
const DEFAULT_SUPPORT_EMAIL = 'support@example.com'

export function getDefaultConfig(): AdminConfig {
  return {
    challengeOrder: [],
    challengeDurations: {},
    initialCoins: 0,
    minStarsToUnlockByChallengeId: {},
    subscriptionMonthlyPriceUsd: DEFAULT_SUBSCRIPTION_USD,
    supportEmail: DEFAULT_SUPPORT_EMAIL,
  }
}

function clampMinStars(n: number): number {
  return Math.max(0, Math.min(3, Math.round(n)))
}

function clampSubscriptionUsd(n: number): number {
  return Math.max(0, Math.min(999.99, Math.round(n * 100) / 100))
}

export function getConfig(): AdminConfig {
  if (typeof window === 'undefined') return getDefaultConfig()
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY)
    if (!raw) return getDefaultConfig()
    const parsed = JSON.parse(raw) as Partial<AdminConfig>
    const defaultConfig = getDefaultConfig()
    const minStarsByChallenge =
      parsed.minStarsToUnlockByChallengeId && typeof parsed.minStarsToUnlockByChallengeId === 'object'
        ? Object.fromEntries(
            Object.entries(parsed.minStarsToUnlockByChallengeId)
              .filter(([, v]) => typeof v === 'number')
              .map(([k, v]) => [k, clampMinStars(v)])
          )
        : defaultConfig.minStarsToUnlockByChallengeId
    return {
      challengeOrder: Array.isArray(parsed.challengeOrder) ? parsed.challengeOrder : defaultConfig.challengeOrder,
      challengeDurations: parsed.challengeDurations && typeof parsed.challengeDurations === 'object'
        ? parsed.challengeDurations
        : defaultConfig.challengeDurations,
      initialCoins: typeof parsed.initialCoins === 'number' && parsed.initialCoins >= 0
        ? parsed.initialCoins
        : defaultConfig.initialCoins,
      minStarsToUnlockByChallengeId: minStarsByChallenge,
      subscriptionMonthlyPriceUsd: typeof parsed.subscriptionMonthlyPriceUsd === 'number'
        ? clampSubscriptionUsd(parsed.subscriptionMonthlyPriceUsd)
        : defaultConfig.subscriptionMonthlyPriceUsd,
      supportEmail: typeof parsed.supportEmail === 'string' && parsed.supportEmail.trim().length > 0
        ? parsed.supportEmail.trim()
        : defaultConfig.supportEmail,
    }
  } catch {
    return getDefaultConfig()
  }
}

export function setConfig(config: AdminConfig): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config))
}
