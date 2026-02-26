import { Challenge } from '@/types/challenge'

const TOTAL_LEVELS = 100

const TEMPLATES: Omit<Challenge, 'id' | 'order' | 'unlockRequirement'>[] = [
  {
    title: 'Jumping Jacks',
    description: 'Do as many jumping jacks as you can in 15 seconds!',
    exerciseType: 'jumping-jacks',
    duration: 15,
    difficulty: 'easy',
    icon: '🦘',
  },
  {
    title: 'Squat Power',
    description: 'Do as many squats as you can in 15 seconds!',
    exerciseType: 'squats',
    duration: 15,
    difficulty: 'medium',
    icon: '💪',
  },
  {
    title: 'Dance Party',
    description: 'Dance your best moves for 15 seconds!',
    exerciseType: 'dancing',
    duration: 15,
    difficulty: 'easy',
    icon: '🕺',
  },
  {
    title: 'High Knees',
    description: 'Run in place with high knees for 15 seconds!',
    exerciseType: 'high-knees',
    duration: 15,
    difficulty: 'medium',
    icon: '🏃',
  },
  {
    title: 'Push-ups',
    description: 'Do as many push-ups as you can in 15 seconds!',
    exerciseType: 'push-ups',
    duration: 15,
    difficulty: 'hard',
    icon: '💪',
  },
  {
    title: 'Plank Hold',
    description: 'Hold a plank position for 15 seconds!',
    exerciseType: 'plank',
    duration: 15,
    difficulty: 'hard',
    icon: '🧘',
  },
  {
    title: 'Boxing Challenge',
    description: 'Throw as many punches as you can! Count every punch you throw.',
    exerciseType: 'boxing',
    duration: 15,
    difficulty: 'medium',
    icon: '🥊',
  },
  {
    title: 'Match it!',
    description: 'Match the shape shown with your body! Use your arms and body to make the same shape.',
    exerciseType: 'match-it',
    duration: 15,
    difficulty: 'easy',
    icon: '🔷',
  },
  {
    title: 'Jumps',
    description: 'Jump in place as many times as you can! Simple and fun.',
    exerciseType: 'jumps',
    duration: 15,
    difficulty: 'easy',
    icon: '⬆️',
  },
  {
    title: 'Bear Crawls',
    description: 'Hands and feet on the floor, hips high, move across the room. Great for shoulder stability!',
    exerciseType: 'bear-crawls',
    duration: 15,
    difficulty: 'medium',
    icon: '🐻',
  },
  {
    title: 'Frog Jumps',
    description: 'Squat low and explode upward! Excellent for leg power.',
    exerciseType: 'frog-jumps',
    duration: 15,
    difficulty: 'medium',
    icon: '🐸',
  },
  {
    title: 'Crab Walk',
    description: 'Sit on the floor, lift your hips, and walk on hands and feet. A secret core and arm killer!',
    exerciseType: 'crab-walk',
    duration: 15,
    difficulty: 'medium',
    icon: '🦀',
  },
  {
    title: 'Wall Sits',
    description: '"Sit" against a wall with knees at 90 degrees. See if you can last through the whole time!',
    exerciseType: 'wall-sits',
    duration: 20,
    difficulty: 'hard',
    icon: '🧱',
  },
  {
    title: 'Supermans',
    description: 'Lie on your belly and lift arms and legs off the floor. You\'re "flying" over a city!',
    exerciseType: 'supermans',
    duration: 15,
    difficulty: 'medium',
    icon: '🦸',
  },
]

function buildChallenges(): Challenge[] {
  const list: Challenge[] = []
  for (let i = 0; i < TOTAL_LEVELS; i++) {
    const template = TEMPLATES[i % TEMPLATES.length]
    const id = String(i + 1)
    list.push({
      ...template,
      id,
      order: i + 1,
      unlockRequirement: i === 0 ? undefined : { previousChallengeId: String(i), minStars: 2 },
    })
  }
  return list
}

export const ALL_CHALLENGES: Challenge[] = buildChallenges()
