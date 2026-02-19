'use client'

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react'
import { Challenge } from '@/types/challenge'
import { AdminConfig } from '@/types/config'
import { getConfig, getDefaultConfig } from '@/utils/config'
import { ALL_CHALLENGES } from '@/data/challenges'

interface ConfigContextType {
  config: AdminConfig
  /** Challenges with order and durations applied from config */
  challenges: Challenge[]
  initialCoins: number
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

function mergeChallenges(base: Challenge[], config: AdminConfig): Challenge[] {
  const byId = new Map(base.map(c => [c.id, c]))
  const order = config.challengeOrder.length > 0
    ? config.challengeOrder
    : [...base].sort((a, b) => a.order - b.order).map(c => c.id)

  const ordered: Challenge[] = []
  const seen = new Set<string>()

  for (const id of order) {
    const c = byId.get(id)
    if (c && !seen.has(id)) {
      seen.add(id)
      const duration = config.challengeDurations[id] ?? c.duration
      const clampedDuration = Math.max(5, Math.min(60, duration)) // 5–60 seconds
      ordered.push({ ...c, order: ordered.length + 1, duration: clampedDuration })
    }
  }

  // Append any challenges not in order list
  for (const c of base) {
    if (!seen.has(c.id)) {
      const duration = config.challengeDurations[c.id] ?? c.duration
      const clampedDuration = Math.max(5, Math.min(60, duration))
      ordered.push({ ...c, order: ordered.length + 1, duration: clampedDuration })
    }
  }

  return ordered
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<AdminConfig>(() =>
    typeof window !== 'undefined' ? getConfig() : getDefaultConfig()
  )

  useEffect(() => {
    setConfigState(getConfig())
  }, [])
  // Re-read config when storage changes (e.g. admin saved in another tab)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'exercise-game-admin-config' && e.newValue) {
        try {
          setConfigState(JSON.parse(e.newValue) as AdminConfig)
        } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const challenges = useMemo(
    () => mergeChallenges(ALL_CHALLENGES, config),
    [config]
  )

  const value = useMemo(
    () => ({
      config,
      challenges,
      initialCoins: typeof config.initialCoins === 'number' && config.initialCoins >= 0
        ? config.initialCoins
        : 0,
    }),
    [config, challenges]
  )

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const ctx = useContext(ConfigContext)
  if (ctx === undefined) {
    throw new Error('useConfig must be used within ConfigProvider')
  }
  return ctx
}
