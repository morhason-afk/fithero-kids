export function calculateStars(score: number): number {
  if (score >= 85) return 3
  if (score >= 60) return 2
  if (score >= 33) return 1
  return 0
}

export function calculateCoinsFromStars(stars: number, baseCoins: number = 20): number {
  // Base coins multiplied by stars
  return baseCoins * stars
}

export function getStarEmoji(stars: number): string {
  if (stars === 3) return '⭐⭐⭐'
  if (stars === 2) return '⭐⭐'
  if (stars === 1) return '⭐'
  return ''
}
