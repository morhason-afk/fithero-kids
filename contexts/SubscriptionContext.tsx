'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [hasSubscription, setState] = useState(false)
  const [modalReason, setModalReason] = useState<SubscriptionReason | null>(null)

  // Subscription is not persisted: after every refresh the app behaves as if the user has no subscription.

  const setHasSubscription = (value: boolean) => {
    setState(value)
  }

  const showSubscriptionMessage = (reason: SubscriptionReason) => {
    setModalReason(reason)
  }

  return (
    <SubscriptionContext.Provider value={{ hasSubscription, setHasSubscription, showSubscriptionMessage }}>
      {children}
      {modalReason && (
        <SubscriptionModal
          reason={modalReason}
          onClose={() => setModalReason(null)}
          onSuccess={() => setHasSubscription(true)}
        />
      )}
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
