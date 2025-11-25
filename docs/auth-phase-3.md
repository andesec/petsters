# Phase 3 – Party Card Redesign

## Goals
- Rebuild party cards with premium visual polish: layered shadows, refined borders, gradients, and compact spacing.
- Enhance subcomponents (drag handle, type badges, HP bar, remove control) without regressing drag-and-drop functionality.
- Align the experience with mockups for both light and dark themes.

## Planned Changes
- Update layout, spacing, and elevation states in `SortablePetCard.tsx`.
- Redesign the drag handle and remove button with icons, hover/touch affordances, and accessible hit areas.
- Apply gradient-driven badge and HP bar styling with smooth transitions and contrast-safe typography.

## Files Touched
- `src/components/party/SortablePetCard.tsx`.
- Supporting theme tokens in `src/app/globals.css` or utility files if new variables are required.

## Deployment & Config Notes
- Validate drag-and-drop in a static export before pushing to GitHub Pages; run `npm run build` followed by `npm run export` when applicable.
- Confirm asset paths for badge/handle icons resolve correctly when served from a GitHub Pages base path.
- If Cognito is enabled, ensure authenticated users can still reorder/save parties by verifying `src/config.ts` and session handling in `AuthService`.
