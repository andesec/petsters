# Phase 4 – Sidebar Enhancements

## Goals
- Align left and right sidebars with the modernized visual system and improve focus/hover interactions.
- Refine the mobile modal experience for sidebar content switching.
- Maintain consistency across search, joystick, battle updates, and contextual panels.

## Planned Changes
- Refresh search inputs, dropdowns, and info panels in `LeftSidebar.tsx` with polished states and transitions.
- Harmonize `RightSidebar.tsx` styling, including battle updates and joystick integration.
- Tune mobile modal/tab visuals and animations within `GameLayout.tsx`.

## Files Touched
- `src/components/LeftSidebar.tsx`.
- `src/components/RightSidebar.tsx`.
- `src/components/GameLayout.tsx`.

## Deployment & Config Notes
- Exercise mobile and desktop breakpoints in a preview build: `npm run build` then `npm run start` (or `npm run export` for GitHub Pages).
- When hosting on GitHub Pages, verify modal assets and joystick icons load from the correct relative paths.
- If Cognito gating is required for sidebar data, confirm `AuthGuard` usage and `src/config.ts` values before deployment.
