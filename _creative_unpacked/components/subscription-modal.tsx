"use client"

import { X, Check, Sparkles } from "lucide-react"

interface SubscriptionModalProps {
  onClose: () => void
}

export function SubscriptionModal({ onClose }: SubscriptionModalProps) {
  const benefits = [
    "All challenges unlocked",
    "More hero customization options",
    "No advertisements",
    "Exclusive weekly events",
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Subscription"
    >
      <div
        className="animate-bounce-in relative w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center font-serif text-xl font-bold text-card-foreground">
          Unlock More Adventures!
        </h2>
        <p className="mb-5 text-center text-sm text-muted-foreground">
          Get access to all challenges and customization.
        </p>

        {/* Benefits list */}
        <ul className="mb-6 flex flex-col gap-2.5">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2.5 text-sm text-card-foreground">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
                <Check className="h-3 w-3" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        {/* Price */}
        <p className="mb-4 text-center">
          <span className="font-serif text-2xl font-bold text-card-foreground">
            $4.99
          </span>
          <span className="text-sm text-muted-foreground"> USD / month</span>
        </p>

        {/* CTAs */}
        <button className="w-full rounded-2xl bg-primary px-6 py-3.5 font-serif text-base font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]">
          Subscribe
        </button>
        <button
          onClick={onClose}
          className="mt-3 w-full rounded-xl py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
