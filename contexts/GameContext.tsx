'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ChallengeProgress } from '@/types/challenge'
import { updateChallengeProgress } from '@/utils/challengeProgression'

interface GameContextType {
  challengeProgress: ChallengeProgress[]
  updateProgress: (challengeId: string, stars: number) => void
  getProgress: (challengeId: string) => ChallengeProgress | undefined
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const STORAGE_KEY = 'exercise-game-progress'

function loadProgressFromStorage(): ChallengeProgress[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [challengeProgress, setChallengeProgress] = useState<ChallengeProgress[]>([])

  // Load from localStorage after mount
  useEffect(() => {
    setChallengeProgress(loadProgressFromStorage())
  }, [])

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(challengeProgress))
    }
  }, [challengeProgress])

  const updateProgress = (challengeId: string, stars: number) => {
    setChallengeProgress(prev => updateChallengeProgress(prev, challengeId, stars))
  }

  const getProgress = (challengeId: string) => {
    return challengeProgress.find(p => p.challengeId === challengeId)
  }

  return (
    <GameContext.Provider value={{ challengeProgress, updateProgress, getProgress }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
