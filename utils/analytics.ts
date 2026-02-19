import { AnalyticsEvent, AnalyticsData, DailyStats } from '@/types/analytics'

const ANALYTICS_STORAGE_KEY = 'exercise-game-analytics'
const MAX_EVENTS = 10000 // Keep last 10k events

function getUserId(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  // Use a stable user ID stored in localStorage
  const USER_ID_KEY = 'exercise-game-user-id'
  let userId = localStorage.getItem(USER_ID_KEY)
  
  if (!userId) {
    // Generate a new stable user ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(USER_ID_KEY, userId)
  }
  
  return userId
}

export function trackEvent(type: AnalyticsEvent['type'], data?: AnalyticsEvent['data']): void {
  if (typeof window === 'undefined') return

  try {
    const userId = getUserId()
    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      userId,
      data,
    }

    const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY)
    let analytics: AnalyticsData

    if (stored) {
      try {
        analytics = JSON.parse(stored)
        // Convert old format if needed
        if (!analytics.events || !Array.isArray(analytics.events)) {
          analytics = { events: [], lastProcessed: 0 }
        }
      } catch {
        analytics = { events: [], lastProcessed: 0 }
      }
    } else {
      analytics = { events: [], lastProcessed: 0 }
    }

    analytics.events.push(event)

    // Keep only recent events
    if (analytics.events.length > MAX_EVENTS) {
      analytics.events = analytics.events.slice(-MAX_EVENTS)
    }

    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics))
  } catch (error) {
    console.error('Failed to track analytics event:', error)
  }
}

export function getAnalyticsData(): AnalyticsData {
  if (typeof window === 'undefined') {
    return { events: [], lastProcessed: 0 }
  }

  try {
    const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY)
    if (!stored) return { events: [], lastProcessed: 0 }

    const parsed = JSON.parse(stored)
    if (!parsed.events || !Array.isArray(parsed.events)) {
      return { events: [], lastProcessed: 0 }
    }

    return parsed
  } catch {
    return { events: [], lastProcessed: 0 }
  }
}

export function clearAnalyticsData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ANALYTICS_STORAGE_KEY)
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getDateRange(days: number = 7): string[] {
  const dates: string[] = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(formatDate(date))
  }
  return dates
}

export function getDailyStats(days: number = 7): Map<string, DailyStats> {
  const analytics = getAnalyticsData()
  const dateRange = getDateRange(days)
  const statsMap = new Map<string, DailyStats>()

  // Initialize all dates
  dateRange.forEach(date => {
    statsMap.set(date, {
      date,
      activeUsers: new Set(),
      challengeCompletions: 0,
      purchases: 0,
      uniquePurchasers: new Set(),
    })
  })

  // Process events
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  analytics.events.forEach(event => {
    const eventDate = new Date(event.timestamp)
    if (eventDate < cutoffDate) return

    const dateKey = formatDate(eventDate)
    const stats = statsMap.get(dateKey)
    if (!stats) return

    stats.activeUsers.add(event.userId)

    if (event.type === 'challenge_completed') {
      stats.challengeCompletions++
    } else if (event.type === 'purchase') {
      stats.purchases++
      stats.uniquePurchasers.add(event.userId)
    }
  })

  return statsMap
}

export function getChallengeCompletionDistribution(): Map<number, number> {
  const analytics = getAnalyticsData()
  const userCompletions = new Map<string, number>()

  analytics.events.forEach(event => {
    if (event.type === 'challenge_completed') {
      const current = userCompletions.get(event.userId) || 0
      userCompletions.set(event.userId, current + 1)
    }
  })

  // Count distribution: how many users completed X challenges
  const distribution = new Map<number, number>()
  userCompletions.forEach(count => {
    const current = distribution.get(count) || 0
    distribution.set(count, current + 1)
  })

  return distribution
}
