'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { WeeklyGoal, WeeklyProgress } from '@/types/weeklyGoal'
import { getCurrentWeekStart, isNewWeek, resetWeeklyProgress, addStarsToWeeklyProgress, sendNotification } from '@/utils/weeklyGoal'

interface WeeklyGoalContextType {
  goal: WeeklyGoal
  progress: WeeklyProgress
  updateGoal: (goal: Partial<WeeklyGoal>) => void
  addStars: (stars: number) => void
}

const WeeklyGoalContext = createContext<WeeklyGoalContextType | undefined>(undefined)

const STORAGE_KEY_GOAL = 'exercise-game-weekly-goal'
const STORAGE_KEY_PROGRESS = 'exercise-game-weekly-progress'

const DEFAULT_GOAL: WeeklyGoal = {
  starsRequired: 25,
  giftDescription: 'a special treat',
  notificationMethod: 'message',
}

function loadGoalFromStorage(): WeeklyGoal {
  if (typeof window === 'undefined') return DEFAULT_GOAL
  try {
    const stored = localStorage.getItem(STORAGE_KEY_GOAL)
    if (!stored) return { ...DEFAULT_GOAL }
    const parsed = JSON.parse(stored)
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_GOAL }
    const starsRequired = typeof parsed.starsRequired === 'number' && parsed.starsRequired >= 1 && parsed.starsRequired <= 999
      ? parsed.starsRequired
      : DEFAULT_GOAL.starsRequired
    const goal: WeeklyGoal = {
      starsRequired,
      giftDescription: typeof parsed.giftDescription === 'string' ? parsed.giftDescription : DEFAULT_GOAL.giftDescription,
      notificationMethod: ['email', 'whatsapp', 'push', 'message'].includes(parsed.notificationMethod) ? parsed.notificationMethod : DEFAULT_GOAL.notificationMethod,
      notificationContact: typeof parsed.notificationContact === 'string' ? parsed.notificationContact : undefined,
    }
    return goal
  } catch {
    return { ...DEFAULT_GOAL }
  }
}

function loadProgressFromStorage(): WeeklyProgress | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PROGRESS)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (!parsed || typeof parsed !== 'object') return null
    if (typeof parsed.weekStartDate !== 'number' || typeof parsed.starsEarned !== 'number') return null
    return {
      weekStartDate: parsed.weekStartDate,
      starsEarned: Math.max(0, Math.min(999, parsed.starsEarned)),
      completed: Boolean(parsed.completed),
      completedDate: typeof parsed.completedDate === 'number' ? parsed.completedDate : undefined,
    }
  } catch {
    return null
  }
}

export function WeeklyGoalProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState<WeeklyGoal>(DEFAULT_GOAL)
  const [progress, setProgress] = useState<WeeklyProgress | null>(null)

  // Load from localStorage after mount
  useEffect(() => {
    setGoal(loadGoalFromStorage())
    const storedProgress = loadProgressFromStorage()
    
    // Reset if new week
    if (isNewWeek(storedProgress)) {
      setProgress(resetWeeklyProgress())
    } else {
      setProgress(storedProgress || resetWeeklyProgress())
    }
  }, [])

  // Save to localStorage whenever goal or progress changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_GOAL, JSON.stringify(goal))
      if (progress) {
        localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress))
      }
    }
  }, [goal, progress])

  // Check for new week periodically
  useEffect(() => {
    const checkNewWeek = () => {
      if (progress && isNewWeek(progress)) {
        setProgress(resetWeeklyProgress())
      }
    }
    
    const interval = setInterval(checkNewWeek, 60 * 60 * 1000) // Check every hour
    return () => clearInterval(interval)
  }, [progress])

  const updateGoal = (updates: Partial<WeeklyGoal>) => {
    setGoal(prev => ({ ...prev, ...updates }))
  }

  const addStars = (stars: number) => {
    if (!progress) {
      setProgress(resetWeeklyProgress())
      return
    }

    const newProgress = addStarsToWeeklyProgress(progress, stars, goal)
    setProgress(newProgress)

    // Check if goal was just completed
    if (newProgress.completed && !progress.completed) {
      sendNotification(goal).catch(error => {
        console.error('Failed to send notification:', error)
      })
    }
  }

  return (
    <WeeklyGoalContext.Provider value={{ goal, progress: progress || resetWeeklyProgress(), updateGoal, addStars }}>
      {children}
    </WeeklyGoalContext.Provider>
  )
}

export function useWeeklyGoal() {
  const context = useContext(WeeklyGoalContext)
  if (context === undefined) {
    throw new Error('useWeeklyGoal must be used within a WeeklyGoalProvider')
  }
  return context
}
