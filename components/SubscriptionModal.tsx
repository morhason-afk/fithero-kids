'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '@/contexts/ConfigContext'
import styles from './SubscriptionModal.module.css'

const DEMO_CVC = '669'

interface SubscriptionModalProps {
  reason: 'challenges' | 'heroes' | 'face'
  onClose: () => void
  onSuccess: () => void
}

const TITLES: Record<SubscriptionModalProps['reason'], string> = {
  challenges: 'Unlock All Challenges',
  heroes: 'Unlock All Character Options',
  face: 'Unlock All Face Options',
}

const DESCRIPTIONS: Record<SubscriptionModalProps['reason'], string> = {
  challenges: 'Challenges 1–4 are free. From challenge 5 onward: subscribe to play the rest!',
  heroes: 'First 5 in each category (skin, outfit, accessories) are free or for diamonds. Subscribe to unlock the rest!',
  face: 'First 5 in each category (eyes, mouth, accessory, background) are free or for diamonds. Subscribe to unlock the rest!',
}

export default function SubscriptionModal({ reason, onClose, onSuccess }: SubscriptionModalProps) {
  const { config } = useConfig()
  const priceUsd = typeof config.subscriptionMonthlyPriceUsd === 'number' && config.subscriptionMonthlyPriceUsd >= 0
    ? config.subscriptionMonthlyPriceUsd
    : 4.99
  const priceDisplay = priceUsd === 0 ? 'Free' : `$${priceUsd.toFixed(2)} USD/month`
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmedCvc = cvc.trim()
    const trimmedCard = cardNumber.replace(/\s/g, '')
    if (trimmedCvc !== DEMO_CVC) {
      setError(`Invalid card. For demo use CVC ${DEMO_CVC}.`)
      return
    }
    if (trimmedCard.length < 4) {
      setError('Please enter a valid card number (any digits).')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      onSuccess()
      onClose()
    }, 600)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 className={styles.title}>{TITLES[reason]}</h2>
        <p className={styles.description}>{DESCRIPTIONS[reason]}</p>
        <p className={styles.price}>{priceDisplay}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="card">Card number</label>
            <input
              id="card"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 19))}
              className={styles.input}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="expiry">Expiry (MM/YY)</label>
              <input
                id="expiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={expiry}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                  if (v.length >= 2) setExpiry(v.slice(0, 2) + '/' + v.slice(2))
                  else setExpiry(v)
                }}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="cvc">CVC</label>
              <input
                id="cvc"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="669"
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className={styles.input}
              />
            </div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitButton} disabled={submitting}>
            {submitting ? 'Processing…' : 'Subscribe'}
          </button>
        </form>

        <p className={styles.demoHint}>Demo: use any card number and CVC {DEMO_CVC}</p>
      </div>
    </div>
  )
}
