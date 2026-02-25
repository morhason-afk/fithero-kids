"use client"

import { Settings, Star } from "lucide-react"

interface WeeklyGoalWidgetProps {
  current: number
  goal: number
  onSettings?: () => void
}

export function WeeklyGoalWidget({ current, goal, onSettings }: WeeklyGoalWidgetProps) {
  const percent = Math.min((current / goal) * 100, 100)

  return (
    <section className="rounded-2xl game-border-thick border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif text-base font-bold text-card-foreground uppercase tracking-wide">
          Weekly Goal
        </h3>
        <button
          onClick={onSettings}
          className="flex h-8 w-8 items-center justify-center rounded-lg game-border border-border bg-muted text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          aria-label="Edit goal"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Progress text */}
      <div className="mb-2 flex items-center gap-1.5 text-sm font-bold text-card-foreground">
        <span>{current} / {goal}</span>
        <Star className="h-4 w-4 fill-accent text-accent" />
        <span className="text-muted-foreground font-normal">this week</span>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-4 w-full overflow-hidden rounded-full bg-muted game-border border-border">
        <div
          className="xp-bar h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={goal}
        />
      </div>

      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
        Goal: {goal} stars for a special treat!
      </p>
    </section>
  )
}
