# Phase 7 – Responsive Optimization

## Goals
- Guarantee usability across mobile, tablet, and desktop breakpoints without visual regressions.
- Validate touch targets and drag interactions on small screens.
- Ensure layout scales gracefully at large viewports with proper max-width and spacing rules.

## Planned Changes
- Test and adjust party card interactions on common mobile widths (375–414px).
- Verify sidebar behaviors and content density at tablet breakpoints (768–1024px).
- Confirm desktop spacing, max-widths, and typography scaling at 1440px+.

## Files Touched
- Responsive styles within `SortablePetCard.tsx`, `Header.tsx`, `LeftSidebar.tsx`, `RightSidebar.tsx`, and `GameLayout.tsx`.
- Global responsive utilities in `src/app/globals.css` if new breakpoints or spacing rules are introduced.

## Deployment & Config Notes
- Run `npm run build` and smoke test with `npm run start` across viewport sizes; capture screenshots for GitHub Pages documentation.
- If exporting statically for GitHub Pages, confirm any dynamic routes render correctly and that assets resolve via relative URLs.
- Validate Cognito flows on mobile by testing hosted UI redirects or embedded login from `src/components/auth` on real devices/emulators.
