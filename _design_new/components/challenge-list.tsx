"use client"

import { Lock, Clock, Gem, ChevronRight } from "lucide-react"
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
    tag: "NEW",
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
    tag: "HOT",
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
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-serif text-2xl font-bold text-foreground uppercase tracking-wide">
          Challenges
        </h2>
        <div className="h-1 flex-1 rounded-full bg-border" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {challenges.filter(c => !c.locked).length} available
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
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
        "game-card group relative flex w-full items-start gap-4 rounded-2xl bg-card p-4 text-left",
        "game-border-thick",
        locked
          ? "cursor-not-allowed border-border opacity-50"
          : featured
            ? "border-primary/60 shadow-[0_0_20px_rgba(255,107,53,0.15)]"
            : "border-border hover:border-primary/40 hover:shadow-[0_0_15px_rgba(255,107,53,0.1)]"
      )}
    >
      {/* Tag badge */}
      {tag && !locked && (
        <span className={cn(
          "absolute -top-3 right-3 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest game-border",
          tag === "NEW"
            ? "border-secondary bg-secondary text-secondary-foreground"
            : "border-destructive bg-destructive text-destructive-foreground"
        )}>
          {tag}
        </span>
      )}

      {/* Emoji icon area */}
      <div
        className={cn(
          "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl game-border text-3xl",
          locked
            ? "border-border bg-muted"
            : featured
              ? "border-primary/30 bg-primary/10"
              : "border-border bg-muted"
        )}
      >
        {locked ? (
          <Lock className="h-6 w-6 text-muted-foreground" />
        ) : (
          <span className="drop-shadow-md">{emoji}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="font-serif text-base font-bold text-card-foreground leading-tight uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
          {locked ? lockReason : description}
        </p>
        {/* Meta row */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-lg game-border border-secondary/30 bg-secondary/10 px-2 py-0.5 text-[11px] font-bold text-secondary">
            <Clock className="h-3 w-3" />
            {duration}
          </span>
          {!locked && (
            <span className="flex items-center gap-1 rounded-lg game-border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
              <Gem className="h-3 w-3" />
              {rewardMin}&ndash;{rewardMax}
            </span>
          )}
        </div>
      </div>

      {/* Play arrow for unlocked */}
      {!locked && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <ChevronRight className="h-4 w-4" />
        </div>
      )}
    </button>
  )
}
