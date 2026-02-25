# Dark theme – keep it consistent

The app uses a **single dark game theme**. To avoid breaking it when adding features or refactoring:

## 1. Use only design tokens

All colors must come from **`app/design-system.css`** (and `app/globals.css`). Do **not** hardcode:

- White or off-white backgrounds (`#fff`, `#F3F4F6`, `#E5E7EB`, etc.)
- Light gray text (`#6B7280`, `#374151`, `#1F2937`)
- Purple/light gradients that don’t match the theme

Use the CSS variables instead, e.g. `var(--card)`, `var(--primary)`, `var(--muted-foreground)`.

## 2. Token quick reference

- **Backgrounds**: `--background`, `--card`, `--muted`
- **Text**: `--foreground`, `--card-foreground`, `--muted-foreground`
- **Actions**: `--primary`, `--secondary`, `--accent` (and their `-foreground` where needed)
- **Borders**: `--border`
- **Errors**: `--error`

## 3. New components

- Modals / overlays: dark card (`var(--card)`), 4px border (`var(--border)`), tokens for all text and inputs.
- Buttons: primary = orange (`--primary`); secondary/cancel = muted + border.
- Inputs: muted background, border, primary focus.

## 4. Cursor rule

A Cursor rule in **`.cursor/rules/dark-theme.mdc`** is set to **always apply**. It reminds the AI to preserve this theme and use tokens only. Keep that rule enabled so future edits don’t revert to a light look.

If the design ever looks “ruined” again, re-check component CSS for any reintroduced light colors and replace them with the correct `var(--...)` tokens from `app/design-system.css`.
