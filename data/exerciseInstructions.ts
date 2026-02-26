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
      'Throw punches forward at the camera',
      'Every punch you throw will be counted!',
      'Throw as many as you can before time runs out.'
    ],
    emoji: '🥊',
    visualHint: '👊 → 👊 → 👊'
  },
  'match-it': {
    exerciseType: 'match-it',
    title: 'Match it!',
    steps: [
      'Look at the shape shown on screen',
      'Use your body to make the same shape',
      'Stretch your arms and move to match',
      'Hold the pose when you have it!',
      'Have fun being a human shape!'
    ],
    emoji: '🔷',
    visualHint: '👤 → 🔷 → ✨'
  },
  'jumps': {
    exerciseType: 'jumps',
    title: 'Jumps',
    steps: [
      'Stand in place facing the camera',
      'Jump straight up and land softly',
      'We count every jump you do',
      'Jump as many times as you can!',
      'Bend your knees when you land.'
    ],
    emoji: '⬆️',
    visualHint: '👤 → ⬆️ → 👤 → ⬆️'
  },
  'bear-crawls': {
    exerciseType: 'bear-crawls',
    title: 'Bear Crawls',
    steps: [
      'Get on your hands and feet on the floor',
      'Keep your hips high in the air',
      'Move across the room on hands and feet',
      'Great for shoulder stability!',
      'Keep your back flat like a table.'
    ],
    emoji: '🐻',
    visualHint: '🐻 → 🐻 → 🐻'
  },
  'frog-jumps': {
    exerciseType: 'frog-jumps',
    title: 'Frog Jumps',
    steps: [
      'Squat down low like a frog',
      'Explode upward in a jump',
      'Land softly and squat again',
      'Excellent for leg power!',
      'Push through your feet to jump.'
    ],
    emoji: '🐸',
    visualHint: '🐸 → ⬆️ → 🐸'
  },
  'crab-walk': {
    exerciseType: 'crab-walk',
    title: 'Crab Walk',
    steps: [
      'Sit on the floor with hands behind you',
      'Lift your hips off the floor',
      'Walk on your hands and feet',
      'Move forward or sideways!',
      'A secret core and arm workout.'
    ],
    emoji: '🦀',
    visualHint: '🦀 → 🦀 → 🦀'
  },
  'wall-sits': {
    exerciseType: 'wall-sits',
    title: 'Wall Sits',
    steps: [
      'Stand with your back against a wall',
      'Slide down until knees are at 90 degrees',
      '"Sit" without a chair!',
      'Hold as long as you can',
      'See if you can last the whole time!'
    ],
    emoji: '🧱',
    visualHint: '🧱 👤 ⏱️'
  },
  'supermans': {
    exerciseType: 'supermans',
    title: 'Supermans',
    steps: [
      'Lie on your belly on the floor',
      'Lift your arms and legs off the floor',
      'You\'re "flying" over a city!',
      'Hold for a few seconds',
      'Lower and repeat. You\'re a superhero!'
    ],
    emoji: '🦸',
    visualHint: '🦸 ✈️'
  },
}
