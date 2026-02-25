"use client"

import { useState } from "react"
import {
  X,
  ArrowLeft,
  Lock,
  Gem,
  Crown,
  Check,
  Shirt,
  Palette,
  Sparkles,
  Shield,
  Zap,
  Music,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomizationScreenProps {
  onClose: () => void
  diamonds: number
  isSubscribed?: boolean
}

type Category = "characters" | "outfits" | "effects" | "backgrounds" | "sounds"

interface CustomizationItem {
  id: string
  label: string
  icon: string
  cost: number | "sub"
  owned?: boolean
  equipped?: boolean
}

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "characters", label: "Heroes", icon: <Shield className="h-4 w-4" /> },
  { id: "outfits", label: "Outfits", icon: <Shirt className="h-4 w-4" /> },
  { id: "effects", label: "Effects", icon: <Sparkles className="h-4 w-4" /> },
  { id: "backgrounds", label: "Arenas", icon: <Palette className="h-4 w-4" /> },
  { id: "sounds", label: "Sounds", icon: <Music className="h-4 w-4" /> },
]

const ITEMS: Record<Category, CustomizationItem[]> = {
  characters: [
    { id: "hero-default", label: "FitHero", icon: "\uD83E\uDDB8", cost: 0, owned: true, equipped: true },
    { id: "hero-ninja", label: "Ninja", icon: "\uD83E\uDD77", cost: 50, owned: true },
    { id: "hero-robot", label: "RoboHero", icon: "\uD83E\uDD16", cost: 120 },
    { id: "hero-dragon", label: "Dragon Rider", icon: "\uD83D\uDC09", cost: 200 },
    { id: "hero-astro", label: "Astronaut", icon: "\uD83D\uDE80", cost: "sub" },
    { id: "hero-wizard", label: "Wizard", icon: "\uD83E\uDDD9", cost: "sub" },
  ],
  outfits: [
    { id: "outfit-default", label: "Classic", icon: "\uD83D\uDC55", cost: 0, owned: true, equipped: true },
    { id: "outfit-sport", label: "Sporty", icon: "\uD83E\uDD3E", cost: 30, owned: true },
    { id: "outfit-gold", label: "Gold Armor", icon: "\uD83D\uDEE1\uFE0F", cost: 150 },
    { id: "outfit-rainbow", label: "Rainbow", icon: "\uD83C\uDF08", cost: 80 },
    { id: "outfit-space", label: "Space Suit", icon: "\uD83D\uDC68\u200D\uD83D\uDE80", cost: "sub" },
    { id: "outfit-royal", label: "Royal Cape", icon: "\uD83E\uDE99", cost: "sub" },
  ],
  effects: [
    { id: "fx-none", label: "None", icon: "\u2B50", cost: 0, owned: true, equipped: true },
    { id: "fx-sparkles", label: "Sparkles", icon: "\u2728", cost: 40 },
    { id: "fx-fire", label: "Fire Trail", icon: "\uD83D\uDD25", cost: 100 },
    { id: "fx-lightning", label: "Lightning", icon: "\u26A1", cost: 90 },
    { id: "fx-rainbow", label: "Rainbow Aura", icon: "\uD83C\uDF1F", cost: "sub" },
    { id: "fx-confetti", label: "Confetti", icon: "\uD83C\uDF89", cost: 60 },
  ],
  backgrounds: [
    { id: "bg-park", label: "City Park", icon: "\uD83C\uDFDE\uFE0F", cost: 0, owned: true, equipped: true },
    { id: "bg-beach", label: "Beach", icon: "\uD83C\uDFD6\uFE0F", cost: 50 },
    { id: "bg-space", label: "Outer Space", icon: "\uD83C\uDF0C", cost: 100 },
    { id: "bg-jungle", label: "Jungle", icon: "\uD83C\uDF34", cost: 75 },
    { id: "bg-castle", label: "Castle", icon: "\uD83C\uDFF0", cost: "sub" },
    { id: "bg-underwater", label: "Underwater", icon: "\uD83C\uDF0A", cost: "sub" },
  ],
  sounds: [
    { id: "snd-default", label: "Classic", icon: "\uD83C\uDFB5", cost: 0, owned: true, equipped: true },
    { id: "snd-retro", label: "Retro", icon: "\uD83C\uDFAE", cost: 30 },
    { id: "snd-epic", label: "Epic", icon: "\uD83C\uDFBA", cost: 80 },
    { id: "snd-chill", label: "Chill Beats", icon: "\uD83C\uDFA7", cost: 60 },
    { id: "snd-nature", label: "Nature", icon: "\uD83C\uDF3F", cost: 45 },
    { id: "snd-dj", label: "DJ Mix", icon: "\uD83E\uDD35", cost: "sub" },
  ],
}

export function CustomizationScreen({
  onClose,
  diamonds,
  isSubscribed = false,
}: CustomizationScreenProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("characters")
  const [localItems, setLocalItems] = useState(ITEMS)
  const [localDiamonds, setLocalDiamonds] = useState(diamonds)
  const [lastAction, setLastAction] = useState<string | null>(null)

  const items = localItems[activeCategory]

  function handleBuy(item: CustomizationItem) {
    if (item.cost === "sub" || item.owned) return
    if (localDiamonds < item.cost) return

    setLocalDiamonds((d) => d - (item.cost as number))
    setLocalItems((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((i) =>
        i.id === item.id ? { ...i, owned: true } : i
      ),
    }))
    setLastAction(`Purchased ${item.label}!`)
    setTimeout(() => setLastAction(null), 2000)
  }

  function handleEquip(item: CustomizationItem) {
    if (!item.owned) return

    setLocalItems((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((i) =>
        i.id === item.id
          ? { ...i, equipped: true }
          : { ...i, equipped: false }
      ),
    }))
    setLastAction(`Equipped ${item.label}!`)
    setTimeout(() => setLastAction(null), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Customize Hero"
    >
      <div
        className="animate-bounce-in relative flex w-full max-w-lg flex-col rounded-3xl bg-card shadow-xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="flex-1 font-serif text-xl font-bold text-card-foreground">
            Customize
          </h2>
          {/* Diamond balance */}
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
            <Gem className="h-4 w-4" />
            <span>{localDiamonds}</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-4 py-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Toast */}
          {lastAction && (
            <div className="animate-count-up mb-3 flex items-center gap-2 rounded-xl bg-success/10 px-4 py-2.5 text-sm font-semibold text-success">
              <Check className="h-4 w-4" />
              {lastAction}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item) => {
              const isSub = item.cost === "sub"
              const canAfford = !isSub && localDiamonds >= (item.cost as number)
              const isLocked = isSub && !isSubscribed

              return (
                <div
                  key={item.id}
                  className={cn(
                    "group relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all",
                    item.equipped
                      ? "border-primary bg-primary/5 shadow-sm"
                      : item.owned
                        ? "border-border bg-card hover:border-primary-light"
                        : isLocked
                          ? "border-border bg-muted/50"
                          : "border-border bg-card hover:border-primary-light"
                  )}
                >
                  {/* Equipped badge */}
                  {item.equipped && (
                    <span className="absolute -top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      Equipped
                    </span>
                  )}

                  {/* Sub-only crown */}
                  {isLocked && (
                    <span className="absolute -top-2 left-2 flex items-center gap-0.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                      <Crown className="h-3 w-3" /> PRO
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-xl text-3xl",
                      isLocked ? "opacity-50 grayscale" : ""
                    )}
                  >
                    {isLocked ? (
                      <div className="relative flex h-full w-full items-center justify-center">
                        <span className="opacity-40">{item.icon}</span>
                        <Lock className="absolute h-5 w-5 text-muted-foreground" />
                      </div>
                    ) : (
                      <span>{item.icon}</span>
                    )}
                  </div>

                  {/* Label */}
                  <span className="text-center text-xs font-semibold text-card-foreground leading-tight">
                    {item.label}
                  </span>

                  {/* Cost or action button */}
                  {item.equipped ? (
                    <span className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      <Check className="h-3 w-3" />
                      Active
                    </span>
                  ) : item.owned ? (
                    <button
                      onClick={() => handleEquip(item)}
                      className="rounded-lg bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary transition-colors hover:bg-secondary/20"
                    >
                      Equip
                    </button>
                  ) : isLocked ? (
                    <span className="flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                      <Crown className="h-3 w-3" />
                      Subscribers
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={cn(
                        "flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                        canAfford
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "cursor-not-allowed bg-muted text-muted-foreground"
                      )}
                    >
                      <Gem className="h-3 w-3" />
                      {item.cost as number}
                      {!canAfford && (
                        <Lock className="ml-0.5 h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Earn diamonds by completing challenges!
            </p>
            <div className="flex items-center gap-1 text-xs text-primary font-semibold">
              <Zap className="h-3.5 w-3.5" />
              <span>Earn more</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
