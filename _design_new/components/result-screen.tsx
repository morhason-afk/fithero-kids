"use client"

import { Star, RotateCcw, X, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

export type ResultLevel = "amazing" | "great" | "tryagain"

interface ResultScreenProps {
  level: ResultLevel
  stars: number
  feedback: string
  diamonds: number
  isPersonalBest?: boolean
  onPlayAgain: () => void
  onClose: () => void
}

export function ResultScreen({
  level,
  stars,
  feedback,
  diamonds,
  isPersonalBest = false,
  onPlayAgain,
  onClose,
}: ResultScreenProps) {
  const titles: Record<ResultLevel, string> = {
    amazing: "AMAZING!",
    great: "GREAT JOB!",
    tryagain: "TRY AGAIN!",
  }

  const isCelebrating = level === "amazing" || level === "great"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Challenge Result"
    >
      <div
        className={cn(
          "noise-bg animate-bounce-in relative w-full max-w-sm rounded-3xl game-border-thick p-6 shadow-xl",
          isCelebrating
            ? "border-accent/50 bg-card shadow-[0_0_40px_rgba(255,230,109,0.15)]"
            : "border-border bg-card"
        )}
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

        {/* Confetti dots for celebration */}
        {isCelebrating && <ConfettiDots />}

        {/* Title */}
        <div className="mb-4 text-center">
          <h2
            className={cn(
              "font-serif text-3xl font-bold uppercase tracking-wider",
              level === "amazing"
                ? "text-primary"
                : level === "great"
                  ? "text-secondary"
                  : "text-muted-foreground"
            )}
          >
            {titles[level]}
          </h2>
        </div>

        {/* Stars */}
        <div className="mb-4 flex items-center justify-center gap-3">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              className={cn(
                "h-12 w-12 animate-star-pop drop-shadow-lg",
                i <= stars
                  ? "fill-accent text-accent"
                  : "fill-muted text-muted"
              )}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* Personal best badge */}
        {isPersonalBest && stars === 3 && (
          <div className="mx-auto mb-4 flex w-fit items-center gap-1.5 rounded-xl game-border border-accent/40 bg-accent/20 px-3 py-1.5 text-xs font-black text-accent uppercase tracking-widest">
            <Trophy className="h-3.5 w-3.5" />
            NEW PERSONAL BEST!
          </div>
        )}

        {/* Feedback */}
        <p className="mb-5 text-center text-sm text-muted-foreground leading-relaxed">
          {feedback}
        </p>

        {/* Diamond reward */}
        <div className="animate-count-up mb-6 flex items-center justify-center gap-2">
          <span className="text-3xl">{'\uD83D\uDC8E'}</span>
          <span className="font-serif text-4xl font-bold text-primary drop-shadow-[0_0_10px_rgba(255,107,53,0.4)]">
            +{diamonds}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onPlayAgain}
            className="game-btn flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-serif text-base font-bold text-primary-foreground uppercase tracking-wide"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again!
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl py-2 text-sm font-bold text-muted-foreground uppercase tracking-wider transition-colors hover:text-foreground"
          >
            Back to challenges
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfettiDots() {
  const colors = ["bg-accent", "bg-primary", "bg-secondary", "bg-success", "bg-primary-light"]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "absolute h-2.5 w-2.5 rounded-full",
            colors[i % colors.length]
          )}
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${5 + Math.random() * 30}%`,
            animationName: "confetti-fall",
            animationDuration: `${1.5 + Math.random() * 1.5}s`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationTimingFunction: "ease-out",
            animationFillMode: "forwards",
          }}
        />
      ))}
    </div>
  )
}
