'use client'

import { useState, useEffect } from 'react'
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './WeeklyGoalSettings.module.css'

interface WeeklyGoalSettingsProps {
  onClose: () => void
}

export default function WeeklyGoalSettings({ onClose }: WeeklyGoalSettingsProps) {
  const { goal, updateGoal } = useWeeklyGoal()
  const { t } = useLanguage()
  const [starsRequired, setStarsRequired] = useState(goal.starsRequired)
  const [giftDescription, setGiftDescription] = useState(goal.giftDescription)
  const [notificationMethod, setNotificationMethod] = useState(goal.notificationMethod)
  const [notificationContact, setNotificationContact] = useState(goal.notificationContact || '')

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleSave = () => {
    updateGoal({
      starsRequired,
      giftDescription,
      notificationMethod,
      notificationContact: notificationContact.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="button" tabIndex={-1} aria-label={t('Close')}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t('⚙️ Configure Weekly Goal')}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.field}>
            <label>{t('Stars Required This Week')}</label>
            <input
              type="number"
              min="1"
              max="50"
              value={starsRequired}
              onChange={(e) => setStarsRequired(parseInt(e.target.value) || 1)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label>{t('Gift Description')}</label>
            <input
              type="text"
              value={giftDescription}
              onChange={(e) => setGiftDescription(e.target.value)}
              placeholder="e.g., a special treat, extra screen time, a new toy"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label>{t('Notification Method')}</label>
            <select
              value={notificationMethod}
              onChange={(e) => setNotificationMethod(e.target.value as any)}
              className={styles.select}
            >
              <option value="message">{t('In-App Message')}</option>
              <option value="email">{t('Email')}</option>
              <option value="whatsapp">{t('WhatsApp')}</option>
              <option value="push">{t('Browser Push Notification')}</option>
            </select>
          </div>

          {(notificationMethod === 'email' || notificationMethod === 'whatsapp') && (
            <div className={styles.field}>
              <label>
                {notificationMethod === 'email' ? t('Email Address') : t('WhatsApp Number')}
              </label>
              <input
                type={notificationMethod === 'email' ? 'email' : 'tel'}
                value={notificationContact}
                onChange={(e) => setNotificationContact(e.target.value)}
                placeholder={
                  notificationMethod === 'email'
                    ? 'parent@example.com'
                    : '+1234567890'
                }
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              {t('Cancel')}
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              {t('Save Settings')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
