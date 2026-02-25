'use client'

import { useState } from 'react'
import { useConfig } from '@/contexts/ConfigContext'
import { useLanguage } from '@/contexts/LanguageContext'
import SupportModal from './SupportModal'
import styles from './Footer.module.css'

export default function Footer() {
  const { config } = useConfig()
  const { t } = useLanguage()
  const [showSupport, setShowSupport] = useState(false)
  const supportEmail = config.supportEmail?.trim() || 'support@example.com'

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.brandColumn}>
          <div className={styles.brandLogo}>
            <span className={styles.brandIcon} aria-hidden>⚡</span>
            <span className={styles.brandName}>{t('FitHero')}</span>
          </div>
          <p className={styles.brandTagline}>
            {t('Making fitness fun for the next generation of superheroes.')}
          </p>
          <p className={styles.servedBy}>{t('by YOM Games')}</p>
        </div>
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>{t('Game')}</h4>
          <ul className={styles.columnList}>
            <li><a href="#challenges">{t('Challenges')}</a></li>
            <li><a href="#leaderboard">{t('Leaderboard')}</a></li>
            <li><a href="#rewards">{t('Rewards')}</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>{t('Parents')}</h4>
          <ul className={styles.columnList}>
            <li><a href="/admin">{t('Dashboard')}</a></li>
            <li><a href="#safety">{t('Safety')}</a></li>
            <li><a href="#subscription">{t('Subscription')}</a></li>
            <li>
              <button type="button" className={styles.supportLink} onClick={() => setShowSupport(true)}>
                {t('Contact support')}
              </button>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>{t('Newsletter')}</h4>
          <div className={styles.newsletterRow}>
            <input type="email" placeholder={t("Parent's email")} className={styles.newsletterInput} aria-label={t("Parent's email")} />
            <button type="button" className={styles.newsletterButton}>{t('Join')}</button>
          </div>
        </div>
      </div>
      <p className={styles.copyright}>© {new Date().getFullYear()} {t('FitHero Kids')} • YOM Games • {t('All rights reserved.')}</p>
      {showSupport && (
        <SupportModal supportEmail={supportEmail} onClose={() => setShowSupport(false)} />
      )}
    </footer>
  )
}
