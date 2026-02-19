'use client'

import { useState } from 'react'
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext'
import styles from './WeeklyGoalSettings.module.css'

interface WeeklyGoalSettingsProps {
  onClose: () => void
}

export default function WeeklyGoalSettings({ onClose }: WeeklyGoalSettingsProps) {
  const { goal, updateGoal } = useWeeklyGoal()
  const [starsRequired, setStarsRequired] = useState(goal.starsRequired)
  const [giftDescription, setGiftDescription] = useState(goal.giftDescription)
  const [notificationMethod, setNotificationMethod] = useState(goal.notificationMethod)
  const [notificationContact, setNotificationContact] = useState(goal.notificationContact || '')

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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>⚙️ Configure Weekly Goal</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.field}>
            <label>Stars Required This Week</label>
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
            <label>Gift Description</label>
            <input
              type="text"
              value={giftDescription}
              onChange={(e) => setGiftDescription(e.target.value)}
              placeholder="e.g., a special treat, extra screen time, a new toy"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label>Notification Method</label>
            <select
              value={notificationMethod}
              onChange={(e) => setNotificationMethod(e.target.value as any)}
              className={styles.select}
            >
              <option value="message">In-App Message</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="push">Browser Push Notification</option>
            </select>
          </div>

          {(notificationMethod === 'email' || notificationMethod === 'whatsapp') && (
            <div className={styles.field}>
              <label>
                {notificationMethod === 'email' ? 'Email Address' : 'WhatsApp Number'}
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
              Cancel
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
