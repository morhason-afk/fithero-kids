/** Star thresholds: 1 star = 50%+, 2 stars = 70%+, 3 stars = 90%+ (doing challenge as instructed) */
export const STAR_THRESHOLDS = { one: 0.5, two: 0.7, three: 0.9 } as const

/** Stars from a 0-100 score (used for video verification). Uses same % idea: 90+, 70+, 50+. */
export function calculateStars(score: number): number {
  if (score >= 90) return 3
  if (score >= 70) return 2
  if (score >= 50) return 1
  return 0
}

/** Stars from compliance ratio (0–1): share of time/opportunities the kid did as instructed. */
export function calculateStarsFromCompliance(complianceRatio: number): number {
  if (complianceRatio >= STAR_THRESHOLDS.three) return 3
  if (complianceRatio >= STAR_THRESHOLDS.two) return 2
  if (complianceRatio >= STAR_THRESHOLDS.one) return 1
  return 0
}

export function calculateCoinsFromStars(stars: number, baseCoins: number = 20): number {
  return baseCoins * stars
}

export function getStarEmoji(stars: number): string {
  if (stars === 3) return '⭐⭐⭐'
  if (stars === 2) return '⭐⭐'
  if (stars === 1) return '⭐'
  return ''
}

/** Result screen title: 0–1 = try again, 2 = celebratory, 3 = most celebratory */
export function getResultTitle(stars: number): string {
  if (stars >= 3) return 'Amazing!'
  if (stars === 2) return 'Great job!'
  return 'Try again'
}

/** Whether to show celebration (confetti, etc.) on result screen */
export function shouldCelebrate(stars: number): boolean {
  return stars >= 2
}
