export interface Challenge {
  id: string
  title: string
  description: string
  exerciseType: 'jumping-jacks' | 'squats' | 'push-ups' | 'stretching' | 'dancing' | 'running' | 'plank' | 'burpees' | 'lunges' | 'high-knees' | 'boxing' | 'fruit-ninja'
  duration: number // in seconds (max 15)
  difficulty: 'easy' | 'medium' | 'hard'
  icon: string
  order: number // Order in progression (1, 2, 3, etc.)
  unlockRequirement?: {
    previousChallengeId: string
    minStars: number // Need at least this many stars to unlock
  }
}

export interface ExerciseResult {
  score: number // 0-100
  stars: number // 0, 1, 2, or 3
  coins: number
  feedback: string
}

export interface ChallengeProgress {
  challengeId: string
  bestStars: number // Best stars achieved (0-3)
  completed: boolean
}
