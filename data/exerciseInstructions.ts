export interface ExerciseInstruction {
  exerciseType: string
  title: string
  steps: string[]
  emoji: string
  visualHint: string // Emoji or description for visual
}

export const EXERCISE_INSTRUCTIONS: Record<string, ExerciseInstruction> = {
  'jumping-jacks': {
    exerciseType: 'jumping-jacks',
    title: 'Jumping Jacks',
    steps: [
      'Stand with your feet together and arms at your sides',
      'Jump up and spread your legs apart',
      'At the same time, raise your arms above your head',
      'Jump back to starting position',
      'Repeat as fast as you can!'
    ],
    emoji: '🦘',
    visualHint: '👤 → ✨ → 👤 → ✨'
  },
  'squats': {
    exerciseType: 'squats',
    title: 'Squats',
    steps: [
      'Stand with feet shoulder-width apart',
      'Lower your body by bending your knees',
      'Keep your back straight and chest up',
      'Go down until your thighs are parallel to the floor',
      'Push back up to standing position',
      'Repeat!'
    ],
    emoji: '💪',
    visualHint: '👤 → ⬇️ → 👤 → ⬇️'
  },
  'dancing': {
    exerciseType: 'dancing',
    title: 'Dance Party',
    steps: [
      'Move your body to the rhythm',
      'Wave your arms in the air',
      'Move your hips and shake',
      'Have fun and be creative!',
      'Show your best dance moves!'
    ],
    emoji: '🕺',
    visualHint: '💃✨🎵🎶'
  },
  'high-knees': {
    exerciseType: 'high-knees',
    title: 'High Knees',
    steps: [
      'Stand in place',
      'Lift one knee up toward your chest',
      'Quickly switch to the other knee',
      'Keep alternating as fast as you can',
      'Pump your arms like you\'re running!'
    ],
    emoji: '🏃',
    visualHint: '👤 → 🦵 → 👤 → 🦵'
  },
  'push-ups': {
    exerciseType: 'push-ups',
    title: 'Push-ups',
    steps: [
      'Start in plank position on hands and toes',
      'Keep your body straight like a board',
      'Lower your body by bending your arms',
      'Push back up to starting position',
      'Repeat!'
    ],
    emoji: '💪',
    visualHint: '🤸 → ⬇️ → 🤸'
  },
  'plank': {
    exerciseType: 'plank',
    title: 'Plank Hold',
    steps: [
      'Start on your hands and toes',
      'Keep your body straight and strong',
      'Hold this position',
      'Don\'t let your hips sag or rise',
      'Stay strong until time is up!'
    ],
    emoji: '🧘',
    visualHint: '🤸 → ⏸️ → 🤸'
  },
  'boxing': {
    exerciseType: 'boxing',
    title: 'Boxing Challenge',
    steps: [
      'Stand facing the camera',
      'Make fists with both hands',
      'Throw punches at the targets',
      'Alternate between left and right punches',
      'Keep your guard up and have fun!'
    ],
    emoji: '🥊',
    visualHint: '👊 → 🎯 → 👊 → 🎯'
  },
  'fruit-ninja': {
    exerciseType: 'fruit-ninja',
    title: 'Fruit Ninja',
    steps: [
      'Stand facing the camera',
      'Watch for objects falling from the sky',
      'Wave your hands to hit them',
      'Move your arms up and down quickly',
      'Try to hit as many as you can!'
    ],
    emoji: '🍎',
    visualHint: '👋 → 🍎 → ✨ → 👋 → 🍌 → ✨'
  },
}
