"use client"

import { User, Zap } from "lucide-react"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-primary/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
        {/* Left: Logo + branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground game-border border-primary-light">
            <Zap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold text-primary leading-tight tracking-wide uppercase">
              FitHero
            </span>
            <span className="hidden text-[10px] font-bold uppercase tracking-widest text-secondary leading-tight sm:block">
              Move &bull; Play &bull; Grow!
            </span>
          </div>
          <span className="ml-2 hidden rounded-lg bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground md:block">
            by YOM Games
          </span>
        </div>

        {/* Right: Balance + Level + avatar */}
        <div className="flex items-center gap-2">
          <LevelBadge level={5} />
          <BalancePill count={120} />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl game-border border-border bg-muted text-foreground transition-all hover:border-primary hover:text-primary"
            aria-label="User profile"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

function LevelBadge({ level }: { level: number }) {
  return (
    <div className="hidden sm:flex items-center gap-1 rounded-xl game-border border-accent bg-accent/10 px-2.5 py-1.5 text-xs font-bold text-accent uppercase tracking-wide">
      <span className="text-sm">LV</span>
      <span className="font-serif text-base">{level}</span>
    </div>
  )
}

function BalancePill({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl game-border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
      <span className="text-base" role="img" aria-label="Diamonds">
        {'\uD83D\uDC8E'}
      </span>
      <span>{count}</span>
    </div>
  )
}
