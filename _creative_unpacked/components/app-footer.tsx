import { Mail } from "lucide-react"

export function AppFooter() {
  return (
    <footer className="w-full border-t border-border bg-muted">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand block */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Red kite logo">
                {'\u{1FA81}'}
              </span>
              <span className="font-serif text-lg font-bold text-primary">
                FitHero
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Making fitness fun for the next generation of superheroes.
            </p>
            <p className="text-xs text-muted-foreground">
              Served by YOM Games
            </p>
          </div>

          {/* Game links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-sm font-semibold text-foreground">
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
            <h4 className="font-serif text-sm font-semibold text-foreground">
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
            <h4 className="font-serif text-sm font-semibold text-foreground">
              Newsletter
            </h4>
            <p className="text-sm text-muted-foreground">
              Get tips and updates for your little heroes.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  aria-label="Email address"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} FitHero Kids. Served by YOM Games. All rights reserved.
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
      className="text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      {children}
    </a>
  )
}
