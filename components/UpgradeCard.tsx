'use client'

import { useSubscription } from '@/contexts/SubscriptionContext'
import styles from './UpgradeCard.module.css'

export default function UpgradeCard() {
  const { showSubscriptionMessage } = useSubscription()

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => showSubscriptionMessage('challenges')}
    >
      <span className={styles.iconWrap} aria-hidden>👑</span>
      <div className={styles.content}>
        <h3 className={styles.title}>Unlock All Challenges</h3>
        <p className={styles.subtitle}>Go PRO for unlimited fun!</p>
      </div>
    </button>
  )
}
