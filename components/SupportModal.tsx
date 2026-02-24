'use client'

import { useState, useEffect } from 'react'
import styles from './SupportModal.module.css'

interface SupportModalProps {
  supportEmail: string
  onClose: () => void
}

export default function SupportModal({ supportEmail, onClose }: SupportModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Support request from ${firstName.trim() || 'User'} ${lastName.trim()}`)
    const body = encodeURIComponent(
      `First name: ${firstName.trim()}\nLast name: ${lastName.trim()}\nEmail: ${email.trim()}\n\nDescription:\n${description.trim()}`
    )
    const mailto = `mailto:${supportEmail}?subject=${subject}&body=${body}`
    window.location.href = mailto
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="support-title">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 id="support-title" className={styles.title}>Contact support</h2>
        <p className={styles.description}>Fill in your details and we&apos;ll open your email app to send a message to support.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="support-first">First name</label>
              <input
                id="support-first"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className={styles.input}
                placeholder="First name"
                autoComplete="given-name"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="support-last">Last name</label>
              <input
                id="support-last"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className={styles.input}
                placeholder="Last name"
                autoComplete="family-name"
              />
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="support-email">Email</label>
            <input
              id="support-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="support-desc">Description</label>
            <textarea
              id="support-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="How can we help?"
              rows={4}
              required
            />
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Send email
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
