# Phase 2 – Header Redesign

## Goals
- Add personalized header elements (avatar, username, stats) with notification affordances.
- Upgrade the visual system (gradient, typography, spacing, transitions) to match the mockups.
- Preserve responsive behavior across desktop and mobile nav patterns.

## Planned Changes
- Introduce a user profile subcomponent and notification bell within `Header.tsx`.
- Refine navigation spacing, typography, and gradient treatments for the header bar.
- Ensure mobile layout hides or condenses profile metadata while keeping essential actions reachable.

## Files Touched
- `src/components/Header.tsx` (structure, layout, interactive states).
- `src/components/ThemeToggle.tsx` as needed for alignment with the new header layout.

## Deployment & Config Notes
- After implementing UI updates, run `npm run build` to verify SSR/ISR output before publishing to GitHub Pages.
- For GitHub Pages: if using `next export`, confirm header assets (icons, gradients) are either static or referenced with relative paths.
- For Cognito: confirm `src/config.ts` contains the correct `cognito.userPoolId`, `clientId`, and `region` before exposing authenticated header states.
