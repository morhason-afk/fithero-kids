export interface AdminConfig {
  /** Challenge IDs in display order (first = order 1) */
  challengeOrder: string[]
  /** Duration in seconds per challenge ID */
  challengeDurations: Record<string, number>
  /** Starting diamonds for new players */
  initialCoins: number
  /** Per challenge: min stars on previous challenge to unlock this one. Key = challenge id. */
  minStarsToUnlockByChallengeId: Record<string, number>
  /** Monthly subscription price in USD (e.g. 4.99). Shown when purchasing. */
  subscriptionMonthlyPriceUsd: number
  /** Support email for "Contact support" (mailto). */
  supportEmail: string
}
