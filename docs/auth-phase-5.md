# Phase 5 – Global Style System

## Goals
- Establish cohesive color, shadow, and typography systems that support light/dark themes.
- Centralize design tokens for consistent reuse across components and future phases.
- Document usage to keep new features aligned with the refreshed brand language.

## Planned Changes
- Update CSS variables and theme tokens in `src/app/globals.css` (or equivalent) to reflect refined palette and typography scale.
- Extend Tailwind or utility configuration if needed for shadows, gradients, and spacing.
- Apply shared styles to existing components to replace ad-hoc values.

## Files Touched
- `src/app/globals.css`.
- Design system config files (e.g., `tailwind.config.ts` if added later).

## Deployment & Config Notes
- Run `npm run lint` and `npm run build` to ensure global token changes do not break server-side rendering.
- For GitHub Pages/static export, confirm global CSS is bundled correctly and respects any configured `basePath`.
- Keep Cognito environment variables (`region`, `userPoolId`, `clientId` in `src/config.ts`) in sync across environments when distributing static exports.
