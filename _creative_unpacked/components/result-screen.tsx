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
    amazing: "Amazing!",
    great: "Great Job!",
    tryagain: "Try Again!",
  }

  const isCelebrating = level === "amazing" || level === "great"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Challenge Result"
    >
      <div
        className={cn(
          "animate-bounce-in relative w-full max-w-sm rounded-3xl p-6 shadow-xl",
          isCelebrating
            ? "bg-gradient-to-b from-accent/20 via-card to-card"
            : "bg-card"
        )}
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

        {/* Confetti dots for celebration */}
        {isCelebrating && <ConfettiDots />}

        {/* Title */}
        <div className="mb-4 text-center">
          <h2
            className={cn(
              "font-serif text-3xl font-bold",
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
        <div className="mb-4 flex items-center justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              className={cn(
                "h-10 w-10 animate-star-pop",
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
          <div className="mx-auto mb-4 flex w-fit items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1.5 text-xs font-bold text-accent-foreground">
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
          <span className="text-2xl">{'\uD83D\uDC8E'}</span>
          <span className="font-serif text-3xl font-bold text-primary">
            +{diamonds}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onPlayAgain}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-serif text-base font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again!
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "absolute h-2 w-2 rounded-full opacity-70",
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
