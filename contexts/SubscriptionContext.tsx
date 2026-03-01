'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import SubscriptionModal from '@/components/SubscriptionModal'

export const SUBSCRIPTION_STORAGE_KEY = 'exercise-game-subscription'
const STORAGE_KEY = SUBSCRIPTION_STORAGE_KEY

type SubscriptionReason = 'challenges' | 'heroes' | 'face'

interface SubscriptionContextType {
  hasSubscription: boolean
  setHasSubscription: (value: boolean) => void
  showSubscriptionMessage: (reason: SubscriptionReason) => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

/** When false, subscription is disabled: all content is open or purchasable with diamonds; no prompts. */
const SUBSCRIPTION_ENABLED = false

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [hasSubscription, setState] = useState(!SUBSCRIPTION_ENABLED)
  const [modalReason, setModalReason] = useState<SubscriptionReason | null>(null)

  // When SUBSCRIPTION_ENABLED is false, hasSubscription is true so no gates apply. Logic remains for when we re-enable.

  const setHasSubscription = (value: boolean) => {
    setState(value)
  }

  const showSubscriptionMessage = (reason: SubscriptionReason) => {
    if (SUBSCRIPTION_ENABLED) setModalReason(reason)
  }

  const modalEl = modalReason ? (
    <SubscriptionModal
      reason={modalReason}
      onClose={() => setModalReason(null)}
      onSuccess={() => setHasSubscription(true)}
    />
  ) : null

  return (
    <SubscriptionContext.Provider value={{ hasSubscription, setHasSubscription, showSubscriptionMessage }}>
      {children}
      {typeof document !== 'undefined' && createPortal(modalEl, document.body)}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (ctx === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return ctx
}
