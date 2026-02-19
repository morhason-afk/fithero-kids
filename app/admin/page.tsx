'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminConfig } from '@/types/config'
import { getConfig, setConfig, getDefaultConfig } from '@/utils/config'
import { ALL_CHALLENGES } from '@/data/challenges'
import styles from './admin.module.css'

function seedConfigFromChallenges(): AdminConfig {
  const sorted = [...ALL_CHALLENGES].sort((a, b) => a.order - b.order)
  return {
    challengeOrder: sorted.map(c => c.id),
    challengeDurations: sorted.reduce((acc, c) => ({ ...acc, [c.id]: c.duration }), {}),
    initialCoins: 0,
  }
}

export default function AdminPage() {
  const [config, setConfigState] = useState<AdminConfig>(getDefaultConfig())
  const [saved, setSaved] = useState(false)
  const [cleared, setCleared] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const loaded = getConfig()
    if (loaded.challengeOrder.length === 0 && loaded.challengeDurations && Object.keys(loaded.challengeDurations).length === 0) {
      setConfigState(seedConfigFromChallenges())
    } else {
      setConfigState(loaded)
    }
    setMounted(true)
  }, [])

  const moveChallenge = (index: number, direction: 'up' | 'down') => {
    const order = [...config.challengeOrder]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= order.length) return
    ;[order[index], order[newIndex]] = [order[newIndex], order[index]]
    setConfigState({ ...config, challengeOrder: order })
    setSaved(false)
  }

  const setDuration = (challengeId: string, seconds: number) => {
    const value = Math.max(5, Math.min(60, Math.round(seconds)))
    setConfigState({
      ...config,
      challengeDurations: { ...config.challengeDurations, [challengeId]: value },
    })
    setSaved(false)
  }

  const setInitialCoins = (value: number) => {
    const n = Math.max(0, Math.round(value))
    setConfigState({ ...config, initialCoins: n })
    setSaved(false)
  }

  const handleSave = () => {
    setConfig(config)
    setSaved(true)
  }

  const clearGameProgress = () => {
    if (typeof window === 'undefined') return
    if (window.confirm('Clear saved hero and progress? Next app reload will show a fresh hero with the current initial coins.')) {
      localStorage.removeItem('exercise-game-hero')
      setCleared(true)
    }
  }

  const resetToDefaults = () => {
    setConfigState(seedConfigFromChallenges())
    setSaved(false)
  }

  if (!mounted) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>Loading admin…</div>
      </div>
    )
  }

  const challengeOrder = config.challengeOrder.length > 0
    ? config.challengeOrder
    : [...ALL_CHALLENGES].sort((a, b) => a.order - b.order).map(c => c.id)
  const byId = new Map(ALL_CHALLENGES.map(c => [c.id, c]))

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>⚙️ Product Admin</h1>
          <p className={styles.subtitle}>
            Change challenge order, durations, and initial coins. Changes apply after users reload the app.
          </p>
          <div className={styles.navLinks}>
            <Link href="/admin/analytics" className={styles.backLink}>
              📊 View Analytics
            </Link>
            <Link href="/" className={styles.backLink}>
              ← Back to app
            </Link>
          </div>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Initial coins</h2>
          <p className={styles.hint}>Starting coins for new players. Existing saved progress keeps current balance; use “Clear game progress” below to test.</p>
          <div className={styles.fieldRow}>
            <input
              type="number"
              min={0}
              max={9999}
              value={config.initialCoins}
              onChange={(e) => setInitialCoins(Number(e.target.value))}
              className={styles.input}
            />
            <span className={styles.unit}>coins</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Challenge order & duration</h2>
          <p className={styles.hint}>Reorder with ↑/↓. Set duration in seconds (5–60).</p>
          <ul className={styles.list}>
            {challengeOrder.map((id, index) => {
              const challenge = byId.get(id)
              if (!challenge) return null
              const duration = config.challengeDurations[id] ?? challenge.duration
              return (
                <li key={id} className={styles.listItem}>
                  <div className={styles.orderButtons}>
                    <button
                      type="button"
                      onClick={() => moveChallenge(index, 'up')}
                      disabled={index === 0}
                      className={styles.orderBtn}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveChallenge(index, 'down')}
                      disabled={index === challengeOrder.length - 1}
                      className={styles.orderBtn}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </div>
                  <span className={styles.icon}>{challenge.icon}</span>
                  <span className={styles.challengeName}>{challenge.title}</span>
                  <div className={styles.durationField}>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={duration}
                      onChange={(e) => setDuration(id, Number(e.target.value))}
                      className={styles.durationInput}
                    />
                    <span className={styles.unit}>sec</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <div className={styles.actions}>
          <button type="button" onClick={resetToDefaults} className={styles.secondaryBtn}>
            Reset to defaults
          </button>
          <button type="button" onClick={clearGameProgress} className={styles.secondaryBtn}>
            Clear game progress
          </button>
          <button type="button" onClick={handleSave} className={styles.primaryBtn}>
            Save configuration
          </button>
        </div>

        {saved && (
          <div className={styles.toast} role="status">
            Saved. Reload the main app for changes to apply.
          </div>
        )}

        {cleared && (
          <div className={styles.toast} role="status">
            Game progress cleared. Reload the main app to see a fresh hero with the current initial coins.
          </div>
        )}
      </div>
    </div>
  )
}
