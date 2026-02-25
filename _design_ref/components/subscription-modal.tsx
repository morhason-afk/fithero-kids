"use client"

import { X, Check, Sparkles, Crown } from "lucide-react"

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Subscription"
    >
      <div
        className="noise-bg animate-bounce-in relative w-full max-w-sm rounded-3xl game-border-thick border-accent/40 bg-card p-6 shadow-[0_0_40px_rgba(255,230,109,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg game-border border-border bg-muted text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl game-border border-accent/40 bg-accent/10 animate-pulse-glow">
            <Crown className="h-8 w-8 text-accent" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center font-serif text-xl font-bold text-card-foreground uppercase tracking-wide">
          Go PRO!
        </h2>
        <p className="mb-5 text-center text-sm text-muted-foreground">
          Unlock all challenges and customization options.
        </p>

        {/* Benefits list */}
        <ul className="mb-6 flex flex-col gap-2.5">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2.5 text-sm font-bold text-card-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg game-border border-success/30 bg-success/20 text-success">
                <Check className="h-3.5 w-3.5" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="font-serif text-3xl font-bold text-card-foreground">
            $4.99
          </span>
          <span className="text-sm text-muted-foreground"> / month</span>
        </div>

        {/* CTAs */}
        <button className="game-btn w-full rounded-xl bg-primary px-6 py-3.5 font-serif text-base font-bold text-primary-foreground uppercase tracking-wide">
          Subscribe Now
        </button>
        <button
          onClick={onClose}
          className="mt-3 w-full rounded-xl py-2 text-sm font-bold text-muted-foreground uppercase tracking-wider transition-colors hover:text-foreground"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
