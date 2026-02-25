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
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Start ${challenge.title}`}
    >
      <div
        className="noise-bg animate-bounce-in relative w-full max-w-sm rounded-3xl game-border-thick border-primary/40 bg-card p-6 shadow-[0_0_40px_rgba(255,107,53,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg game-border border-border bg-muted text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-5 flex flex-col items-center gap-3 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl game-border border-primary/30 bg-primary/10">
            <span className="text-5xl drop-shadow-md">{challenge.emoji}</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-card-foreground uppercase tracking-wide">
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
          className="game-btn flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-serif text-lg font-bold text-primary-foreground uppercase tracking-wide"
        >
          <Gamepad2 className="h-5 w-5" />
          Start Challenge!
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full rounded-xl py-2 text-sm font-bold text-muted-foreground uppercase tracking-wider transition-colors hover:text-foreground"
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
      className={`flex items-center gap-1.5 rounded-xl game-border px-3 py-1.5 text-xs font-bold ${
        highlight
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground"
      }`}
    >
      {icon}
      {label}
    </span>
  )
}
