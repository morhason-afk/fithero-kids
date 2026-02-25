'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminConfig } from '@/types/config'
import { getConfig, setConfig, getDefaultConfig } from '@/utils/config'
import { ALL_CHALLENGES } from '@/data/challenges'
import { SUBSCRIPTION_STORAGE_KEY } from '@/contexts/SubscriptionContext'
import styles from './admin.module.css'

function seedConfigFromChallenges(): AdminConfig {
  const current = getConfig()
  const sorted = [...ALL_CHALLENGES].sort((a, b) => a.order - b.order)
  const defaults = getDefaultConfig()
  return {
    challengeOrder: sorted.map(c => c.id),
    challengeDurations: sorted.reduce((acc, c) => ({ ...acc, [c.id]: c.duration }), {}),
    initialCoins: typeof current.initialCoins === 'number' ? current.initialCoins : 0,
    minStarsToUnlockByChallengeId: current.minStarsToUnlockByChallengeId && typeof current.minStarsToUnlockByChallengeId === 'object'
      ? { ...current.minStarsToUnlockByChallengeId }
      : {},
    subscriptionMonthlyPriceUsd: typeof current.subscriptionMonthlyPriceUsd === 'number' ? current.subscriptionMonthlyPriceUsd : 4.99,
    supportEmail: typeof current.supportEmail === 'string' && current.supportEmail.trim() ? current.supportEmail.trim() : 'support@example.com',
    experiencePerLevel: typeof current.experiencePerLevel === 'number' && current.experiencePerLevel >= 1 ? current.experiencePerLevel : defaults.experiencePerLevel,
    xpPerCustomization: typeof current.xpPerCustomization === 'number' && current.xpPerCustomization >= 0 ? current.xpPerCustomization : defaults.xpPerCustomization,
    xpPerChallengeMax: typeof current.xpPerChallengeMax === 'number' && current.xpPerChallengeMax >= 0 ? current.xpPerChallengeMax : defaults.xpPerChallengeMax,
  }
}

export default function AdminPage() {
  const [config, setConfigState] = useState<AdminConfig>(getDefaultConfig())
  const [saved, setSaved] = useState(false)
  const [cleared, setCleared] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(false)

  useEffect(() => {
    const loaded = getConfig()
    if (loaded.challengeOrder.length === 0 && loaded.challengeDurations && Object.keys(loaded.challengeDurations).length === 0) {
      setConfigState(seedConfigFromChallenges())
    } else {
      setConfigState(loaded)
    }
    try {
      setHasSubscription(localStorage.getItem(SUBSCRIPTION_STORAGE_KEY) === 'true')
    } catch {
      setHasSubscription(false)
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

  const setMinStarsForChallenge = (challengeId: string, value: number) => {
    const n = Math.max(0, Math.min(3, Math.round(value)))
    setConfigState({
      ...config,
      minStarsToUnlockByChallengeId: { ...config.minStarsToUnlockByChallengeId, [challengeId]: n },
    })
    setSaved(false)
  }

  const setSubscriptionPriceUsd = (value: number) => {
    const n = Math.max(0, Math.min(999.99, Math.round(value * 100) / 100))
    setConfigState({ ...config, subscriptionMonthlyPriceUsd: n })
    setSaved(false)
  }

  const setSupportEmail = (value: string) => {
    setConfigState({ ...config, supportEmail: value })
    setSaved(false)
  }

  const setExperiencePerLevel = (value: number) => {
    const n = Math.max(1, Math.round(value))
    setConfigState({ ...config, experiencePerLevel: n })
    setSaved(false)
  }

  const setXpPerCustomization = (value: number) => {
    const n = Math.max(0, Math.round(value))
    setConfigState({ ...config, xpPerCustomization: n })
    setSaved(false)
  }

  const setXpPerChallengeMax = (value: number) => {
    const n = Math.max(0, Math.round(value))
    setConfigState({ ...config, xpPerChallengeMax: n })
    setSaved(false)
  }

  const handleSave = () => {
    setConfig(config)
    setSaved(true)
  }

  const clearGameProgress = () => {
    if (typeof window === 'undefined') return
    if (window.confirm('Clear saved hero and progress? Next app reload will show a fresh hero with the current initial diamonds.')) {
      localStorage.removeItem('exercise-game-hero')
      setCleared(true)
    }
  }

  const toggleSubscription = () => {
    const next = !hasSubscription
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, next ? 'true' : 'false')
      setHasSubscription(next)
    } catch {}
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
            Change challenge order, durations, and initial diamonds. Changes apply after users reload the app.
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
          <h2 className={styles.sectionTitle}>Subscription (for testing)</h2>
          <p className={styles.hint}>Challenges 1–4 free; 5th onward subscription. First 5 hero and 5 face options per category free or diamonds; rest subscription. Toggle to simulate a paying user.</p>
          <div className={styles.fieldRow} style={{ alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={hasSubscription}
                onChange={toggleSubscription}
                className={styles.input}
                style={{ width: 'auto' }}
              />
              <span>Subscription active (unlock all)</span>
            </label>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Subscription & support</h2>
          <p className={styles.hint}>Monthly subscription price (USD) is shown to users when purchasing. Support email is used for the &quot;Contact support&quot; button.</p>
          <div className={styles.fieldRow}>
            <label className={styles.label}>Monthly subscription (USD)</label>
            <input
              type="number"
              min={0}
              max={999.99}
              step={0.01}
              value={config.subscriptionMonthlyPriceUsd}
              onChange={(e) => setSubscriptionPriceUsd(Number(e.target.value))}
              className={styles.input}
            />
            <span className={styles.unit}>USD</span>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label}>Support email</label>
            <input
              type="email"
              value={config.supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className={styles.input}
              style={{ width: '220px' }}
              placeholder="support@example.com"
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Initial diamonds</h2>
          <p className={styles.hint}>Starting diamonds for new players. Existing saved progress keeps current balance; use “Clear game progress” below to test.</p>
          <div className={styles.fieldRow}>
            <input
              type="number"
              min={0}
              max={9999}
              value={config.initialCoins}
              onChange={(e) => setInitialCoins(Number(e.target.value))}
              className={styles.input}
            />
            <span className={styles.unit}>diamonds</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>XP & level progression</h2>
          <p className={styles.hint}>XP per level: points needed to level up. XP per customization: points per skin/outfit/accessory/face change. Max XP per challenge: awarded by stars (1 star = ⅓ max, 2 = ⅔, 3 = max).</p>
          <div className={styles.fieldRow}>
            <label className={styles.label}>XP per level</label>
            <input
              type="number"
              min={1}
              max={999}
              value={config.experiencePerLevel}
              onChange={(e) => setExperiencePerLevel(Number(e.target.value))}
              className={styles.input}
            />
            <span className={styles.unit}>points</span>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label}>XP per customization</label>
            <input
              type="number"
              min={0}
              max={99}
              value={config.xpPerCustomization}
              onChange={(e) => setXpPerCustomization(Number(e.target.value))}
              className={styles.input}
            />
            <span className={styles.unit}>points</span>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label}>Max XP per challenge (by stars)</label>
            <input
              type="number"
              min={0}
              max={99}
              value={config.xpPerChallengeMax}
              onChange={(e) => setXpPerChallengeMax(Number(e.target.value))}
              className={styles.input}
            />
            <span className={styles.unit}>points (1★=⅓, 2★=⅔, 3★=max)</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Challenge order, duration & unlock stars</h2>
          <p className={styles.hint}>Reorder with ↑/↓. Duration in seconds (5–60). Min stars: stars required on the previous challenge to unlock this one (0–3).</p>
          <ul className={styles.list}>
            {challengeOrder.map((id, index) => {
              const challenge = byId.get(id)
              if (!challenge) return null
              const duration = config.challengeDurations[id] ?? challenge.duration
              const minStars = config.minStarsToUnlockByChallengeId[id] ?? challenge.unlockRequirement?.minStars ?? 2
              const isFirst = index === 0
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
                  {!isFirst && (
                    <div className={styles.durationField}>
                      <label className={styles.srOnly}>Min stars to unlock</label>
                      <input
                        type="number"
                        min={0}
                        max={3}
                        value={minStars}
                        onChange={(e) => setMinStarsForChallenge(id, Number(e.target.value))}
                        className={styles.durationInput}
                        title="Min stars on previous challenge to unlock this one"
                      />
                      <span className={styles.unit}>stars</span>
                    </div>
                  )}
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
            Game progress cleared. Reload the main app to see a fresh hero with the current initial diamonds.
          </div>
        )}
      </div>
    </div>
  )
}
