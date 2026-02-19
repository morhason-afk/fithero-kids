'use client'

import { Challenge } from '@/types/challenge'
import { EXERCISE_INSTRUCTIONS } from '@/data/exerciseInstructions'
import styles from './ChallengeInstructions.module.css'

interface ChallengeInstructionsProps {
  challenge: Challenge
  onContinue: () => void
  onBack: () => void
}

export default function ChallengeInstructions({ challenge, onContinue, onBack }: ChallengeInstructionsProps) {
  const instruction = EXERCISE_INSTRUCTIONS[challenge.exerciseType] || {
    title: challenge.title,
    steps: ['Follow the exercise instructions', 'Do your best!'],
    emoji: challenge.icon,
    visualHint: challenge.icon
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>How to Play</h3>
      </div>

      <div className={styles.stepsContainer}>
        {instruction.steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <div className={styles.stepNumber}>{index + 1}</div>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>{step.split(':')[0] || step}</h4>
              {step.includes(':') && (
                <p className={styles.stepDescription}>{step.split(':')[1]}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.demoArea}>
        <div className={styles.demoIcon}>
          {instruction.emoji}
        </div>
        <p className={styles.demoText}>Demo animation plays here</p>
      </div>

      <div className={styles.actions}>
        <button className={styles.continueButton} onClick={onContinue}>
          Got it! Let's Go! 👍
        </button>
      </div>
    </div>
  )
}
