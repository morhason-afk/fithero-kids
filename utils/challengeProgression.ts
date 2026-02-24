import { Challenge, ChallengeProgress } from '@/types/challenge'

/**
 * @param minStarsFromConfig Optional override from admin config. If provided, used instead of challenge.unlockRequirement.minStars.
 */
export function isChallengeUnlocked(
  challenge: Challenge,
  progress: ChallengeProgress[],
  minStarsFromConfig?: number
): boolean {
  // First challenge is always unlocked
  if (challenge.order === 1) return true

  // If no unlock requirement, it's unlocked
  if (!challenge.unlockRequirement) return true

  const requiredStars = typeof minStarsFromConfig === 'number'
    ? minStarsFromConfig
    : challenge.unlockRequirement.minStars

  // Find the previous challenge's progress
  const previousProgress = progress.find(
    p => p.challengeId === challenge.unlockRequirement!.previousChallengeId
  )

  // Unlocked if previous challenge has required stars
  return (
    previousProgress !== undefined &&
    previousProgress.bestStars >= requiredStars
  )
}

export function updateChallengeProgress(
  progress: ChallengeProgress[],
  challengeId: string,
  stars: number
): ChallengeProgress[] {
  const existing = progress.find(p => p.challengeId === challengeId)
  
  if (existing) {
    // Update if this is a better score
    if (stars > existing.bestStars) {
      return progress.map(p =>
        p.challengeId === challengeId
          ? { ...p, bestStars: stars, completed: true }
          : p
      )
    }
    return progress
  }

  // Add new progress entry
  return [
    ...progress,
    {
      challengeId,
      bestStars: stars,
      completed: true,
    },
  ]
}
