'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { HeroBlockRef } from './HeroBlock'
import ShareButton from './ShareButton'
import styles from './MoreModal.module.css'

interface MoreModalProps {
  onClose: () => void
  onScrollToChallenges: () => void
  onContactSupport: () => void
  heroBlockRef: React.RefObject<HeroBlockRef | null>
}

export default function MoreModal({
  onClose,
  onScrollToChallenges,
  onContactSupport,
  heroBlockRef,
}: MoreModalProps) {
  const { language, setLanguage, t } = useLanguage()
  const fallbackShareRef = useRef<HTMLDivElement>(null)
  const shareContainerRef = heroBlockRef?.current?.shareContainerRef ?? fallbackShareRef

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleChallenges = () => {
    onClose()
    onScrollToChallenges()
  }

  const handleSupport = () => {
    onClose()
    onContactSupport()
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={t('More options')}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('More')}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t('Close')}>
            ×
          </button>
        </div>
        <div className={styles.menu}>
          <div className={styles.menuGroup}>
            <span className={styles.menuLabel}>{t('Language')}</span>
            <div className={styles.langToggle} role="group" aria-label="Language">
              <button
                type="button"
                className={`${styles.langBtn} ${language === 'en' ? styles.langBtnActive : ''}`}
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                title="English"
              >
                🇺🇸
              </button>
              <button
                type="button"
                className={`${styles.langBtn} ${language === 'he' ? styles.langBtnActive : ''}`}
                onClick={() => setLanguage('he')}
                aria-pressed={language === 'he'}
                title="עברית"
              >
                🇮🇱
              </button>
            </div>
          </div>
          <div className={`${styles.menuGroup} ${styles.shareWrap}`}>
            <ShareButton shareContainerRef={shareContainerRef} />
          </div>
          <button type="button" className={styles.menuItem} onClick={handleChallenges}>
            <span className={styles.menuIcon}>⭐</span>
            <span>{t('Challenges')}</span>
          </button>
          <button type="button" className={styles.menuItem} onClick={handleSupport}>
            <span className={styles.menuIcon}>✉</span>
            <span>{t('Contact support')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
