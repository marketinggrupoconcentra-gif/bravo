# Design Handoff Guide (Claude Design)

This repository contains the structural and logical foundation for the Bravo México platform. The final visual layer (Claude Design) has not yet been applied.

## Where to Apply Design Tokens
- **CSS Custom Properties:** All design tokens are defined in `src/styles/tokens.css`.
- **Global CSS:** `src/app/globals.css` imports the tokens and applies base styles.
- When the final design kit is ready, update the values inside the `/* PROVISIONAL TOKEN */` sections in `tokens.css`.

## Logo Assets
- Currently using a CSS-based fallback in `src/components/brand/BrandLogo.tsx`.
- Place the final SVGs in `/public/brand/bravo-logo.svg` and `/public/brand/bravo-logo-white.svg` and update the component.

## Component Previews
- A live component showcase is available at `/dev/design-system` (available in local development).
- Use this page to verify that token updates correctly cascade to all interactive elements, typography, and states.

## Tailwind CSS
- Utility classes are heavily used in the React components, but they map back to the CSS custom properties (e.g., `text-[--brand-primary]`, `bg-[--brand-background]`).
- Do not hardcode hex values in the components.
