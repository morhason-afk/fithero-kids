import { Mail, Zap } from "lucide-react"

export function AppFooter() {
  return (
    <footer className="w-full border-t-4 border-border bg-card">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand block */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-5 w-5" />
              </div>
              <span className="font-serif text-lg font-bold text-primary uppercase tracking-wide">
                FitHero
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Making fitness fun for the next generation of superheroes.
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              by YOM Games
            </p>
          </div>

          {/* Game links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-sm font-bold text-foreground uppercase tracking-wide">
              Game
            </h4>
            <nav className="flex flex-col gap-2" aria-label="Game links">
              <FooterLink href="#challenges">Challenges</FooterLink>
              <FooterLink href="#leaderboard">Leaderboard</FooterLink>
              <FooterLink href="#rewards">Rewards</FooterLink>
            </nav>
          </div>

          {/* Parents links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-sm font-bold text-foreground uppercase tracking-wide">
              Parents
            </h4>
            <nav className="flex flex-col gap-2" aria-label="Parents links">
              <FooterLink href="#dashboard">Dashboard</FooterLink>
              <FooterLink href="#safety">Safety</FooterLink>
              <FooterLink href="#subscription">Subscription</FooterLink>
              <FooterLink href="#contact">Contact Support</FooterLink>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-sm font-bold text-foreground uppercase tracking-wide">
              Newsletter
            </h4>
            <p className="text-sm text-muted-foreground">
              Get tips and updates for your little heroes.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-1 items-center gap-2 rounded-xl game-border border-border bg-muted px-3 py-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full min-w-0 bg-transparent text-sm font-bold text-foreground placeholder:text-muted-foreground focus:outline-none"
                  aria-label="Email address"
                />
              </div>
              <button
                type="submit"
                className="game-btn rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground uppercase tracking-wide"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 border-t-4 border-border pt-6 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
          &copy; {new Date().getFullYear()} FitHero Kids &bull; YOM Games &bull; All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary uppercase tracking-wide"
    >
      {children}
    </a>
  )
}
