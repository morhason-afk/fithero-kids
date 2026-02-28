export interface AnalyticsEvent {
  type: 'challenge_completed' | 'purchase' | 'share_customizer'
  timestamp: number // Unix timestamp in milliseconds
  userId: string // Unique user identifier (from hero stats or generated)
  data?: {
    challengeId?: string
    itemId?: string
    itemCost?: number
  }
}

export interface DailyStats {
  date: string // YYYY-MM-DD
  activeUsers: Set<string>
  challengeCompletions: number
  purchases: number
  uniquePurchasers: Set<string>
}

export interface AnalyticsData {
  events: AnalyticsEvent[]
  lastProcessed: number
}
