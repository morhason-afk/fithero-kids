"use client"

import { Lock, Clock, Gem } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Challenge {
  id: string
  emoji: string
  title: string
  description: string
  duration: string
  rewardMin: number
  rewardMax: number
  locked?: boolean
  lockReason?: string
  featured?: boolean
  tag?: string
}

const challenges: Challenge[] = [
  {
    id: "jumping-jacks",
    emoji: "\uD83E\uDD98",
    title: "Jumping Jacks",
    description: "Jump like a kangaroo! Get your heart pumping.",
    duration: "15 sec",
    rewardMin: 20,
    rewardMax: 60,
    featured: true,
    tag: "New",
  },
  {
    id: "boxing",
    emoji: "\uD83E\uDD4A",
    title: "Boxing Challenge",
    description: "Punch the air! Left, right, uppercut!",
    duration: "20 sec",
    rewardMin: 30,
    rewardMax: 80,
  },
  {
    id: "fruit-ninja",
    emoji: "\uD83C\uDF4E",
    title: "Fruit Ninja",
    description: "Slice the fruits with your super moves!",
    duration: "15 sec",
    rewardMin: 20,
    rewardMax: 60,
  },
  {
    id: "dance-party",
    emoji: "\uD83D\uDD7A",
    title: "Dance Party",
    description: "Follow the dance moves and groove!",
    duration: "30 sec",
    rewardMin: 40,
    rewardMax: 100,
    featured: true,
    tag: "Popular",
  },
  {
    id: "ninja-run",
    emoji: "\uD83C\uDFC3",
    title: "Ninja Run",
    description: "Run in place as fast as you can!",
    duration: "25 sec",
    rewardMin: 30,
    rewardMax: 90,
    locked: true,
    lockReason: "Need 2 stars on Boxing Challenge",
  },
  {
    id: "yoga-stretch",
    emoji: "\uD83E\uDDD8",
    title: "Yoga Stretch",
    description: "Stretch and breathe like a calm warrior.",
    duration: "20 sec",
    rewardMin: 15,
    rewardMax: 50,
    locked: true,
    lockReason: "Need 3 stars on Dance Party",
  },
]

interface ChallengeListProps {
  onSelectChallenge: (challenge: Challenge) => void
}

export function ChallengeList({ onSelectChallenge }: ChallengeListProps) {
  return (
    <section className="w-full" aria-label="Fitness Challenges">
      <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
        Challenges
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onClick={() => !challenge.locked && onSelectChallenge(challenge)}
          />
        ))}
      </div>
    </section>
  )
}

function ChallengeCard({
  challenge,
  onClick,
}: {
  challenge: Challenge
  onClick: () => void
}) {
  const { emoji, title, description, duration, rewardMin, rewardMax, locked, lockReason, featured, tag } = challenge

  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={cn(
        "group relative flex w-full items-start gap-4 rounded-2xl bg-card p-4 text-left shadow-sm transition-all",
        "border-2",
        locked
          ? "cursor-not-allowed border-border opacity-60"
          : featured
            ? "border-accent hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            : "border-border hover:border-primary-light hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
      )}
    >
      {/* Tag badge */}
      {tag && !locked && (
        <span className="absolute -top-2.5 right-3 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground">
          {tag}
        </span>
      )}

      {/* Emoji icon */}
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl",
          locked ? "bg-muted" : "bg-primary/10"
        )}
      >
        {locked ? (
          <Lock className="h-6 w-6 text-muted-foreground" />
        ) : (
          <span>{emoji}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="font-serif text-base font-bold text-card-foreground leading-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
          {locked ? lockReason : description}
        </p>
        {/* Meta row */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-lg bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
            <Clock className="h-3 w-3" />
            {duration}
          </span>
          {!locked && (
            <span className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              <Gem className="h-3 w-3" />
              {rewardMin}&ndash;{rewardMax}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
