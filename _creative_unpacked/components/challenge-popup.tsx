"use client"

import { X, Clock, Target, Gem, Gamepad2 } from "lucide-react"
import type { Challenge } from "./challenge-list"

interface ChallengePopupProps {
  challenge: Challenge
  onClose: () => void
  onStart: () => void
}

export function ChallengePopup({ challenge, onClose, onStart }: ChallengePopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Start ${challenge.title}`}
    >
      <div
        className="animate-bounce-in relative w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <span className="text-5xl">{challenge.emoji}</span>
          <h2 className="font-serif text-2xl font-bold text-card-foreground">
            {challenge.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {challenge.description}
          </p>
        </div>

        {/* Info row */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <InfoPill icon={<Clock className="h-4 w-4" />} label={challenge.duration} />
          <InfoPill icon={<Target className="h-4 w-4" />} label="Hit the goal!" />
          <InfoPill
            icon={<Gem className="h-4 w-4" />}
            label={`${challenge.rewardMin}\u2013${challenge.rewardMax}`}
            highlight
          />
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-serif text-lg font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
        >
          <Gamepad2 className="h-5 w-5" />
          Start Challenge!
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full rounded-xl py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to challenges
        </button>
      </div>
    </div>
  )
}

function InfoPill({
  icon,
  label,
  highlight = false,
}: {
  icon: React.ReactNode
  label: string
  highlight?: boolean
}) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${
        highlight
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {icon}
      {label}
    </span>
  )
}
