"use client"

import { Sparkles } from "lucide-react"

interface HeroSectionProps {
  onCustomize?: () => void
}

export function HeroSection({ onCustomize }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-light to-[#74B9FF] p-6 md:p-10">
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary-foreground/5" />

      <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        {/* Character area */}
        <div className="animate-float flex h-36 w-36 shrink-0 items-center justify-center rounded-3xl bg-primary-foreground/15 md:h-44 md:w-44">
          <span className="text-7xl md:text-8xl" role="img" aria-label="Hero character">
            {'\u{1F9B8}'}
          </span>
        </div>

        {/* Text content */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              Level 5
            </span>
            <span className="rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-bold text-primary-foreground">
              FitHero
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl text-balance">
            Ready to move?
          </h1>
          <p className="text-sm text-primary-foreground/80 leading-relaxed md:text-base">
            Complete challenges, earn diamonds, and become the ultimate FitHero!
          </p>
          <div className="mt-1 flex items-center justify-center gap-3 md:justify-start">
            <button className="flex items-center gap-2 rounded-2xl bg-primary-foreground px-6 py-3 font-serif font-bold text-primary shadow-md transition-all hover:shadow-lg active:scale-[0.98]">
              <Sparkles className="h-4 w-4" />
              Play Now
            </button>
            <button
              onClick={onCustomize}
              className="rounded-2xl border-2 border-primary-foreground/30 px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Customize
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
