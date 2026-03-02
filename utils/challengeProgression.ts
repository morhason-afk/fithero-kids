import { Challenge, ChallengeProgress } from '@/types/challenge'

/**
 * Whether a challenge is unlocked. Uses admin config min stars when provided.
 * @param minStarsFromConfig From admin (minStarsToUnlockByChallengeId). Treated as minimum: previous challenge needs this many stars OR MORE to unlock (e.g. 2 means 2+ stars).
 * @param previousChallengeIdInOrder When provided (e.g. from trail display order), the previous challenge is the one right before this in the list—so completing it with enough stars unlocks this one.
 */
export function isChallengeUnlocked(
  challenge: Challenge,
  progress: ChallengeProgress[],
  minStarsFromConfig?: number,
  previousChallengeIdInOrder?: string
): boolean {
  // First in list is always unlocked
  if (previousChallengeIdInOrder === undefined || previousChallengeIdInOrder === '') return true

  const minStarsRequired =
    typeof minStarsFromConfig === 'number'
      ? minStarsFromConfig
      : challenge.unlockRequirement?.minStars ?? 2

  const previousId = previousChallengeIdInOrder ?? challenge.unlockRequirement?.previousChallengeId
  if (!previousId) return true

  const previousProgress = progress.find(p => p.challengeId === previousId)

  // Unlock when previous (in trail order) has at least minStarsRequired (e.g. 2 or more)
  return (
    previousProgress !== undefined &&
    previousProgress.bestStars >= minStarsRequired
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
