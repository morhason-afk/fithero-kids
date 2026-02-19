export interface AdminConfig {
  /** Challenge IDs in display order (first = order 1) */
  challengeOrder: string[]
  /** Duration in seconds per challenge ID */
  challengeDurations: Record<string, number>
  /** Starting coins for new players */
  initialCoins: number
}
