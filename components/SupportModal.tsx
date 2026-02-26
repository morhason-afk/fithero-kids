'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './SupportModal.module.css'

interface SupportModalProps {
  supportEmail: string
  onClose: () => void
}

export default function SupportModal({ supportEmail, onClose }: SupportModalProps) {
  const { t } = useLanguage()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSent(false)

    const subject = `Support request from ${firstName.trim() || 'User'} ${lastName.trim()}`
    const message = [
      `First name: ${firstName.trim()}`,
      `Last name: ${lastName.trim()}`,
      `Email: ${email.trim()}`,
      '',
      'Description:',
      description.trim(),
    ].join('\n')

    try {
      setSubmitting(true)
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: supportEmail,
          subject,
          message,
        }),
      })

      const data = await res.json().catch(() => ({}))
      // Debug: so you can see the response in Console and Network → send-email → Response
      console.log('[Contact support]', res.status, data)

      if (!res.ok) {
        // Prefer details (e.g. Resend error) so user sees the real reason
        const msg = data?.details || data?.error || 'Failed to send email. Please try again.'
        setError(msg)
        setSubmitting(false)
        return
      }

      setSent(true)
      setSubmitting(false)
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network or server error'
      setError(`Could not send: ${message}. You can email us at ${supportEmail}`)
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="support-title">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label={t('Close')}>
          ✕
        </button>
        <h2 id="support-title" className={styles.title}>{t('Contact support')}</h2>
        <p className={styles.description}>{t("Fill in your details and we'll open your email app to send a message to support.")}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="support-first">{t('First name')}</label>
              <input
                id="support-first"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className={styles.input}
                placeholder={t('First name')}
                autoComplete="given-name"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="support-last">{t('Last name')}</label>
              <input
                id="support-last"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className={styles.input}
                placeholder={t('Last name')}
                autoComplete="family-name"
              />
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="support-email">{t('Email')}</label>
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
            <label htmlFor="support-desc">{t('Description')}</label>
            <textarea
              id="support-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder={t('How can we help?')}
              rows={4}
              required
            />
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              {t('Cancel')}
            </button>
            <button type="submit" className={styles.submitButton}>
              {submitting ? t('Processing…') : t('Send email')}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {sent && !error && <p className={styles.success}>{t('Support request sent!')}</p>}
        </form>
      </div>
    </div>
  )
}
