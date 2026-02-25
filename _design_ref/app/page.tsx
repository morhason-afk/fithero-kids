"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { HeroSection } from "@/components/hero-section"
import { ChallengeList, type Challenge } from "@/components/challenge-list"
import { ChallengePopup } from "@/components/challenge-popup"
import { ResultScreen, type ResultLevel } from "@/components/result-screen"
import { WeeklyGoalWidget } from "@/components/weekly-goal"
import { SubscriptionModal } from "@/components/subscription-modal"
import { WeeklyGoalsScreen } from "@/components/weekly-goals-screen"
import { CustomizationScreen } from "@/components/customization-screen"
import { Crown } from "lucide-react"

export default function FitHeroPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [showWeeklyGoals, setShowWeeklyGoals] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)

  function handleStart() {
    setSelectedChallenge(null)
    // Simulate a challenge result
    setTimeout(() => setShowResult(true), 300)
  }

  function handlePlayAgain() {
    setShowResult(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-6 md:px-6 md:py-10">
        {/* Hero */}
        <HeroSection onCustomize={() => setShowCustomization(true)} />

        {/* Weekly goal + Upgrade row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <WeeklyGoalWidget current={12} goal={25} onSettings={() => setShowWeeklyGoals(true)} />

          {/* Upgrade prompt */}
          <button
            onClick={() => setShowSubscription(true)}
            className="game-card group flex items-center gap-4 rounded-2xl game-border-thick border-accent/40 bg-card p-5 shadow-[0_0_20px_rgba(255,230,109,0.1)]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl game-border border-accent/30 bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
              <Crown className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-serif text-sm font-bold text-card-foreground uppercase tracking-wide">
                Unlock All Challenges
              </p>
              <p className="text-xs font-bold text-muted-foreground">
                Go PRO for unlimited fun!
              </p>
            </div>
          </button>
        </div>

        {/* Challenges */}
        <ChallengeList onSelectChallenge={setSelectedChallenge} />
      </main>

      <AppFooter />

      {/* Modals */}
      {selectedChallenge && (
        <ChallengePopup
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onStart={handleStart}
        />
      )}

      {showResult && (
        <ResultScreen
          level="amazing"
          stars={3}
          feedback="You sliced 8 of 10 fruits! Perfect ninja!"
          diamonds={60}
          isPersonalBest
          onPlayAgain={handlePlayAgain}
          onClose={() => setShowResult(false)}
        />
      )}

      {showSubscription && (
        <SubscriptionModal onClose={() => setShowSubscription(false)} />
      )}

      {showWeeklyGoals && (
        <WeeklyGoalsScreen onClose={() => setShowWeeklyGoals(false)} />
      )}

      {showCustomization && (
        <CustomizationScreen
          onClose={() => setShowCustomization(false)}
          diamonds={120}
        />
      )}
    </div>
  )
}
