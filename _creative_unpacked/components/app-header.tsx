"use client"

import { User } from "lucide-react"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
        {/* Left: Logo + branding */}
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none" role="img" aria-label="Red kite logo">
            {'\u{1FA81}'}
          </span>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold text-primary leading-tight">
              FitHero Kids
            </span>
            <span className="hidden text-xs text-muted-foreground leading-tight sm:block">
              Move &bull; Play &bull; Grow!
            </span>
          </div>
          <span className="ml-2 hidden text-[10px] text-muted-foreground md:block">
            Served by YOM Games
          </span>
        </div>

        {/* Right: Balance + avatar */}
        <div className="flex items-center gap-3">
          <BalancePill count={120} />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light/20 text-primary transition-colors hover:bg-primary-light/30"
            aria-label="User profile"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

function BalancePill({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
      <span className="text-base" role="img" aria-label="Diamonds">
        {'\uD83D\uDC8E'}
      </span>
      <span>{count}</span>
    </div>
  )
}
