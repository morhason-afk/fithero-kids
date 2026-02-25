"use client"

import Image from "next/image"
import { Sparkles, ChevronRight, Star, Shield, Zap } from "lucide-react"

interface HeroSectionProps {
  onCustomize?: () => void
}

export function HeroSection({ onCustomize }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl game-border-thick border-primary/30 bg-card">
      {/* Background energy pattern */}
      <div className="noise-bg absolute inset-0 bg-gradient-to-br from-primary/20 via-card to-secondary/10" />

      {/* Radial glow behind character */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col items-center gap-4 px-6 py-8 md:flex-row md:gap-8 md:px-10 md:py-6">
        {/* Full-body character showcase */}
        <div className="relative flex shrink-0 flex-col items-center">
          {/* Energy ring behind character */}
          <div className="animate-energy-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full border-2 border-primary/30" />
          <div className="animate-energy-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full border-2 border-secondary/20" style={{ animationDelay: "0.5s" }} />

          {/* Character platform / pedestal */}
          <div className="relative">
            <div className="animate-hero-idle relative z-10 h-56 w-44 md:h-64 md:w-52">
              <Image
                src="/images/hero-character.jpg"
                alt="FitHero character in superhero pose"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(255,107,53,0.3)]"
                priority
              />
            </div>
            {/* Ground shadow */}
            <div className="mx-auto h-4 w-32 rounded-full bg-foreground/10 blur-md" />
          </div>

          {/* Character name plate */}
          <div className="mt-2 flex items-center gap-2 rounded-xl game-border border-accent/40 bg-accent/10 px-3 py-1.5">
            <Shield className="h-3.5 w-3.5 text-accent" />
            <span className="font-serif text-sm font-bold text-accent uppercase tracking-wide">FitHero</span>
          </div>
        </div>

        {/* Right side: Stats + CTA */}
        <div className="flex flex-1 flex-col items-center gap-4 text-center md:items-start md:text-left">
          {/* Level + Title */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="rounded-lg game-border border-accent bg-accent/20 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wide">
              Level 5
            </span>
            <span className="rounded-lg game-border border-primary bg-primary/20 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wide">
              FitHero
            </span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance uppercase tracking-wide">
            Ready to <span className="text-primary">Move</span>?
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed md:text-base">
            Complete challenges, earn diamonds, and become the ultimate FitHero!
          </p>

          {/* XP Progress bar */}
          <div className="w-full max-w-xs">
            <div className="mb-1 flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground uppercase tracking-wide">XP Progress</span>
              <span className="text-primary">750 / 1000</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-muted game-border border-border">
              <div
                className="xp-bar h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: "75%" }}
                role="progressbar"
                aria-valuenow={750}
                aria-valuemin={0}
                aria-valuemax={1000}
              />
            </div>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap items-center gap-2">
            <StatPill icon={<Star className="h-3.5 w-3.5 fill-accent text-accent" />} label="47 Stars" />
            <StatPill icon={<Zap className="h-3.5 w-3.5 text-primary" />} label="12 Streak" />
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button className="game-btn flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-serif font-bold text-primary-foreground uppercase tracking-wide">
              <Sparkles className="h-5 w-5" />
              Play Now
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={onCustomize}
              className="game-btn-secondary flex items-center gap-2 rounded-xl bg-secondary px-5 py-3.5 font-serif font-bold text-secondary-foreground uppercase tracking-wide"
            >
              Customize
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg game-border border-border bg-muted px-2.5 py-1.5 text-xs font-bold text-foreground">
      {icon}
      <span>{label}</span>
    </div>
  )
}
