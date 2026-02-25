"use client"

import { useState } from "react"
import {
  X,
  Star,
  ChevronDown,
  Bell,
  BellOff,
  Gift,
  Check,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WeeklyGoalsScreenProps {
  onClose: () => void
}

const GOAL_PRESETS = [5, 10, 15, 20, 25, 30, 40, 50]

const NOTIFICATION_OPTIONS = [
  { id: "whatsapp", label: "WhatsApp", icon: "\uD83D\uDCAC" },
  { id: "email", label: "Email", icon: "\u2709\uFE0F" },
  { id: "push", label: "Push Notification", icon: "\uD83D\uDD14" },
  { id: "sms", label: "SMS", icon: "\uD83D\uDCF1" },
]

const REWARD_OPTIONS = [
  { id: "screen-time", label: "30 min extra screen time", icon: "\uD83D\uDCFA" },
  { id: "treat", label: "Special treat", icon: "\uD83C\uDF70" },
  { id: "outing", label: "Fun outing", icon: "\uD83C\uDFA2" },
  { id: "toy", label: "New toy", icon: "\uD83E\uDDF8" },
  { id: "sleepover", label: "Sleepover with friends", icon: "\uD83C\uDFD5\uFE0F" },
  { id: "custom", label: "Custom reward...", icon: "\u270F\uFE0F" },
]

export function WeeklyGoalsScreen({ onClose }: WeeklyGoalsScreenProps) {
  const [starsGoal, setStarsGoal] = useState(25)
  const [notifyAlmostDone, setNotifyAlmostDone] = useState(true)
  const [notifyDone, setNotifyDone] = useState(true)
  const [notifyMethod, setNotifyMethod] = useState("whatsapp")
  const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState("treat")
  const [customReward, setCustomReward] = useState("")
  const [saved, setSaved] = useState(false)

  const selectedNotif = NOTIFICATION_OPTIONS.find((o) => o.id === notifyMethod)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Weekly Goals Settings"
    >
      <div
        className="noise-bg animate-bounce-in relative flex w-full max-w-md flex-col rounded-3xl game-border-thick border-accent/30 bg-card shadow-[0_0_40px_rgba(255,230,109,0.1)] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b-4 border-border px-6 py-4">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg game-border border-border bg-muted text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="flex-1 font-serif text-xl font-bold text-card-foreground uppercase tracking-wide">
            Weekly Goals
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg game-border border-border bg-muted text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-6">
            {/* ---- Section 1: Stars Goal ---- */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <h3 className="font-serif text-base font-bold text-card-foreground uppercase tracking-wide">
                  Stars Goal
                </h3>
              </div>
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                How many stars should your hero collect this week?
              </p>

              {/* Goal display */}
              <div className="mb-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setStarsGoal((g) => Math.max(1, g - 5))}
                  className="flex h-12 w-12 items-center justify-center rounded-xl game-border-thick border-border bg-muted text-lg font-bold text-foreground transition-all hover:border-primary hover:text-primary"
                  aria-label="Decrease goal"
                >
                  -
                </button>
                <div className="flex items-center gap-2 rounded-2xl game-border-thick border-primary/30 bg-primary/10 px-8 py-4">
                  <span className="font-serif text-4xl font-bold text-primary drop-shadow-[0_0_10px_rgba(255,107,53,0.3)]">
                    {starsGoal}
                  </span>
                  <Star className="h-7 w-7 fill-accent text-accent" />
                </div>
                <button
                  onClick={() => setStarsGoal((g) => Math.min(99, g + 5))}
                  className="flex h-12 w-12 items-center justify-center rounded-xl game-border-thick border-border bg-muted text-lg font-bold text-foreground transition-all hover:border-primary hover:text-primary"
                  aria-label="Increase goal"
                >
                  +
                </button>
              </div>

              {/* Quick presets */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {GOAL_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setStarsGoal(preset)}
                    className={cn(
                      "rounded-xl game-border px-3 py-1.5 text-sm font-bold transition-all uppercase",
                      starsGoal === preset
                        ? "border-primary bg-primary text-primary-foreground shadow-[0_0_10px_rgba(255,107,53,0.3)]"
                        : "border-border bg-muted text-muted-foreground hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </section>

            {/* Divider */}
            <div className="h-1 rounded-full bg-border" />

            {/* ---- Section 2: Notifications ---- */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Bell className="h-5 w-5 text-secondary" />
                <h3 className="font-serif text-base font-bold text-card-foreground uppercase tracking-wide">
                  Notifications
                </h3>
              </div>
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                Get notified when your hero is close to the goal or completes it.
              </p>

              {/* Toggle rows */}
              <div className="mb-4 flex flex-col gap-3">
                <ToggleRow
                  icon={<Bell className="h-4 w-4" />}
                  label="Almost done (80%)"
                  checked={notifyAlmostDone}
                  onChange={setNotifyAlmostDone}
                />
                <ToggleRow
                  icon={<Star className="h-4 w-4 fill-accent text-accent" />}
                  label="Goal completed!"
                  checked={notifyDone}
                  onChange={setNotifyDone}
                />
              </div>

              {/* Notification method dropdown */}
              {(notifyAlmostDone || notifyDone) && (
                <div className="relative">
                  <label className="mb-1.5 block text-xs font-black text-muted-foreground uppercase tracking-widest">
                    Send via
                  </label>
                  <button
                    onClick={() => setNotifyDropdownOpen(!notifyDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-xl game-border-thick border-border bg-muted px-4 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary"
                    aria-expanded={notifyDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <span className="flex items-center gap-2">
                      <span>{selectedNotif?.icon}</span>
                      <span>{selectedNotif?.label}</span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        notifyDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {notifyDropdownOpen && (
                    <ul
                      className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl game-border-thick border-border bg-card py-1 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                      role="listbox"
                    >
                      {NOTIFICATION_OPTIONS.map((opt) => (
                        <li key={opt.id}>
                          <button
                            onClick={() => {
                              setNotifyMethod(opt.id)
                              setNotifyDropdownOpen(false)
                            }}
                            className={cn(
                              "flex w-full items-center gap-2 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-muted",
                              notifyMethod === opt.id
                                ? "text-primary"
                                : "text-foreground"
                            )}
                            role="option"
                            aria-selected={notifyMethod === opt.id}
                          >
                            <span>{opt.icon}</span>
                            <span>{opt.label}</span>
                            {notifyMethod === opt.id && (
                              <Check className="ml-auto h-4 w-4 text-primary" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {!notifyAlmostDone && !notifyDone && (
                <div className="flex items-center gap-2 rounded-xl game-border border-border bg-muted px-4 py-3 text-sm font-bold text-muted-foreground">
                  <BellOff className="h-4 w-4" />
                  <span>Notifications are turned off</span>
                </div>
              )}
            </section>

            {/* Divider */}
            <div className="h-1 rounded-full bg-border" />

            {/* ---- Section 3: Reward ---- */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Gift className="h-5 w-5 text-accent" />
                <h3 className="font-serif text-base font-bold text-card-foreground uppercase tracking-wide">
                  Weekly Reward
                </h3>
              </div>
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                What does your hero earn when the goal is reached?
              </p>

              <div className="grid grid-cols-2 gap-2">
                {REWARD_OPTIONS.map((reward) => (
                  <button
                    key={reward.id}
                    onClick={() => setSelectedReward(reward.id)}
                    className={cn(
                      "game-card flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-bold transition-all game-border-thick",
                      selectedReward === reward.id
                        ? "border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(255,107,53,0.2)]"
                        : "border-border bg-muted text-foreground hover:border-primary/40"
                    )}
                  >
                    <span className="text-lg">{reward.icon}</span>
                    <span className="leading-tight">{reward.label}</span>
                  </button>
                ))}
              </div>

              {selectedReward === "custom" && (
                <input
                  type="text"
                  value={customReward}
                  onChange={(e) => setCustomReward(e.target.value)}
                  placeholder="Describe the reward..."
                  className="mt-3 w-full rounded-xl game-border-thick border-border bg-muted px-4 py-3 text-sm font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              )}
            </section>
          </div>
        </div>

        {/* Footer / Save button */}
        <div className="border-t-4 border-border px-6 py-4">
          <button
            onClick={handleSave}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-serif text-base font-bold uppercase tracking-wide",
              saved
                ? "game-btn-secondary bg-success text-success-foreground"
                : "game-btn bg-primary text-primary-foreground"
            )}
          >
            {saved ? (
              <>
                <Check className="h-5 w-5" />
                Saved!
              </>
            ) : (
              "Save Goal Settings"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-xl game-border-thick border-border bg-muted px-4 py-3 text-left transition-all hover:border-primary/40"
      role="switch"
      aria-checked={checked}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 text-sm font-bold text-foreground">
        {label}
      </span>
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full game-border transition-colors",
          checked ? "border-primary bg-primary" : "border-border bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-foreground shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  )
}
