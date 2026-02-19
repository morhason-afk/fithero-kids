'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getDailyStats, getChallengeCompletionDistribution, clearAnalyticsData } from '@/utils/analytics'
import styles from './analytics.module.css'

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [days, setDays] = useState(7)

  useEffect(() => {
    setMounted(true)
  }, [])

  const dailyStats = useMemo(() => {
    if (!mounted) return new Map()
    return getDailyStats(days)
  }, [mounted, days])

  const completionDistribution = useMemo(() => {
    if (!mounted) return new Map()
    return getChallengeCompletionDistribution()
  }, [mounted])

  const handleClearData = () => {
    if (window.confirm('Clear all analytics data? This cannot be undone.')) {
      clearAnalyticsData()
      setMounted(false)
      setTimeout(() => setMounted(true), 100)
    }
  }

  if (!mounted) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>Loading analytics...</div>
      </div>
    )
  }

  const dates = Array.from(dailyStats.keys()).sort()
  const maxActiveUsers = Math.max(...Array.from(dailyStats.values()).map(s => s.activeUsers.size), 1)
  const maxPurchases = Math.max(...Array.from(dailyStats.values()).map(s => s.purchases), 1)
  const maxUniquePurchasers = Math.max(...Array.from(dailyStats.values()).map(s => s.uniquePurchasers.size), 1)
  const maxCompletions = Math.max(...Array.from(completionDistribution.values()), 1)

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>📊 Analytics Dashboard</h1>
          <p className={styles.subtitle}>User activity and engagement metrics</p>
          <div className={styles.navLinks}>
            <Link href="/admin" className={styles.link}>← Back to Admin</Link>
            <Link href="/" className={styles.link}>← Back to App</Link>
          </div>
        </header>

        <div className={styles.controls}>
          <label className={styles.label}>
            Days to show:
            <select value={days} onChange={(e) => setDays(Number(e.target.value))} className={styles.select}>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </label>
          <button onClick={handleClearData} className={styles.clearBtn}>
            Clear All Data
          </button>
        </div>

        {/* Chart 1: Daily Active Users */}
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>Daily Active Users (Unique)</h2>
          <p className={styles.chartSubtitle}>Number of unique players active each day</p>
          <div className={styles.chartContainer}>
            {dates.map(date => {
              const stats = dailyStats.get(date)
              if (!stats) return null
              const count = stats.activeUsers.size
              const height = (count / maxActiveUsers) * 100
              const dateLabel = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              return (
                <div key={date} className={styles.barWrapper}>
                  <div className={styles.barContainer}>
                    <div
                      className={styles.bar}
                      style={{ height: `${height}%` }}
                      title={`${dateLabel}: ${count} users`}
                    >
                      <span className={styles.barValue}>{count}</span>
                    </div>
                  </div>
                  <div className={styles.barLabel}>{dateLabel}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Chart 2: Challenge Completion Distribution */}
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>Challenge Completion Distribution</h2>
          <p className={styles.chartSubtitle}>How many players completed how many challenges</p>
          <div className={styles.chartContainer}>
            {Array.from(completionDistribution.entries())
              .sort((a, b) => a[0] - b[0])
              .map(([challengeCount, playerCount]) => {
                const height = (playerCount / maxCompletions) * 100
                return (
                  <div key={challengeCount} className={styles.barWrapper}>
                    <div className={styles.barContainer}>
                      <div
                        className={styles.bar}
                        style={{ height: `${height}%` }}
                        title={`${playerCount} players completed ${challengeCount} challenge${challengeCount !== 1 ? 's' : ''}`}
                      >
                        <span className={styles.barValue}>{playerCount}</span>
                      </div>
                    </div>
                    <div className={styles.barLabel}>{challengeCount} challenge{challengeCount !== 1 ? 's' : ''}</div>
                  </div>
                )
              })}
            {completionDistribution.size === 0 && (
              <div className={styles.emptyState}>No completion data yet</div>
            )}
          </div>
        </section>

        {/* Chart 3: Daily Purchases */}
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>Daily Purchases</h2>
          <p className={styles.chartSubtitle}>Total number of purchases in customization per day</p>
          <div className={styles.chartContainer}>
            {dates.map(date => {
              const stats = dailyStats.get(date)
              if (!stats) return null
              const count = stats.purchases
              const height = (count / maxPurchases) * 100
              const dateLabel = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              return (
                <div key={date} className={styles.barWrapper}>
                  <div className={styles.barContainer}>
                    <div
                      className={styles.bar}
                      style={{ height: `${height}%`, backgroundColor: '#4caf50' }}
                      title={`${dateLabel}: ${count} purchases`}
                    >
                      <span className={styles.barValue}>{count}</span>
                    </div>
                  </div>
                  <div className={styles.barLabel}>{dateLabel}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Chart 4: Daily Unique Purchasers */}
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>Daily Unique Purchasers</h2>
          <p className={styles.chartSubtitle}>Number of unique players who made purchases each day</p>
          <div className={styles.chartContainer}>
            {dates.map(date => {
              const stats = dailyStats.get(date)
              if (!stats) return null
              const count = stats.uniquePurchasers.size
              const height = (count / maxUniquePurchasers) * 100
              const dateLabel = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              return (
                <div key={date} className={styles.barWrapper}>
                  <div className={styles.barContainer}>
                    <div
                      className={styles.bar}
                      style={{ height: `${height}%`, backgroundColor: '#ff9800' }}
                      title={`${dateLabel}: ${count} unique purchasers`}
                    >
                      <span className={styles.barValue}>{count}</span>
                    </div>
                  </div>
                  <div className={styles.barLabel}>{dateLabel}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Summary Stats */}
        <section className={styles.summarySection}>
          <h2 className={styles.chartTitle}>Summary (Last {days} Days)</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue}>
                {Array.from(dailyStats.values()).reduce((sum, s) => sum + s.activeUsers.size, 0)}
              </div>
              <div className={styles.summaryLabel}>Total Active Users</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue}>
                {Array.from(dailyStats.values()).reduce((sum, s) => sum + s.challengeCompletions, 0)}
              </div>
              <div className={styles.summaryLabel}>Total Challenge Completions</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue}>
                {Array.from(dailyStats.values()).reduce((sum, s) => sum + s.purchases, 0)}
              </div>
              <div className={styles.summaryLabel}>Total Purchases</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue}>
                {new Set(Array.from(dailyStats.values()).flatMap(s => Array.from(s.uniquePurchasers))).size}
              </div>
              <div className={styles.summaryLabel}>Unique Purchasers</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
