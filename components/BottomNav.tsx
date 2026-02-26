'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import styles from './BottomNav.module.css'

interface BottomNavProps {
  onPlay: () => void
  onCharacter: () => void
  onMore: () => void
}

export default function BottomNav({
  onPlay,
  onCharacter,
  onMore,
}: BottomNavProps) {
  const { t } = useLanguage()

  return (
    <nav className={styles.wrap} aria-label="Main navigation">
      <div className={styles.nav}>
        <button
          type="button"
          className={styles.item}
          onClick={onCharacter}
          aria-label={t('Character')}
        >
          <span className={styles.itemIcon} aria-hidden>🧒</span>
          <span>{t('Character')}</span>
        </button>
        <button
          type="button"
          className={`${styles.item} ${styles.itemPrimary}`}
          onClick={onPlay}
          aria-label={t('Play')}
        >
          <span className={styles.itemIcon} aria-hidden>▶</span>
          <span>{t('Play')}</span>
        </button>
        <button
          type="button"
          className={styles.item}
          onClick={onMore}
          aria-label={t('More')}
        >
          <span className={styles.itemIcon} aria-hidden>⋯</span>
          <span>{t('More')}</span>
        </button>
      </div>
    </nav>
  )
}
