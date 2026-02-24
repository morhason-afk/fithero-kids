'use client'

import { useState } from 'react'
import { useConfig } from '@/contexts/ConfigContext'
import SupportModal from './SupportModal'
import styles from './Footer.module.css'

export default function Footer() {
  const { config } = useConfig()
  const [showSupport, setShowSupport] = useState(false)
  const supportEmail = config.supportEmail?.trim() || 'support@example.com'

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.brandColumn}>
          <div className={styles.brandLogo}>
            <span className={styles.brandIcon}>🪁</span>
            <span className={styles.brandName}>FitHero</span>
          </div>
          <p className={styles.brandTagline}>
            Making fitness fun for the next generation of superheroes.
          </p>
          <p className={styles.servedBy}>Served by YOM Games</p>
        </div>
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Game</h4>
          <ul className={styles.columnList}>
            <li><a href="#challenges">Challenges</a></li>
            <li><a href="#leaderboard">Leaderboard</a></li>
            <li><a href="#rewards">Rewards</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Parents</h4>
          <ul className={styles.columnList}>
            <li><a href="/admin">Dashboard</a></li>
            <li><a href="#safety">Safety</a></li>
            <li><a href="#subscription">Subscription</a></li>
            <li>
              <button type="button" className={styles.supportLink} onClick={() => setShowSupport(true)}>
                Contact support
              </button>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Newsletter</h4>
          <div className={styles.newsletterRow}>
            <input type="email" placeholder="Parent's email" className={styles.newsletterInput} aria-label="Parent's email" />
            <button type="button" className={styles.newsletterButton}>Join</button>
          </div>
        </div>
      </div>
      <p className={styles.copyright}>© 2024 FitHero Kids. Served by YOM Games. All rights reserved.</p>
      {showSupport && (
        <SupportModal supportEmail={supportEmail} onClose={() => setShowSupport(false)} />
      )}
    </footer>
  )
}
