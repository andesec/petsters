# Phase 8 – Verification & Testing

## Goals
- Confirm functional parity after modernization (drag/drop, save, navigation, theme toggle, auth flows).
- Validate visual fidelity against desktop and mobile mockups in both light and dark modes.
- Document cross-browser, accessibility, and performance results.

## Planned Changes
- Execute manual test passes for key flows: party management, search, navigation, authentication, and theme switching.
- Capture screenshots at required breakpoints and compare to mockups.
- Perform accessibility checks (keyboard navigation, ARIA labels, contrast) and note any remediation tasks.

## Files Touched
- Test documentation and any fixes across previously modified components (e.g., `SortablePetCard.tsx`, `Header.tsx`, sidebars, `globals.css`).
- Accessibility adjustments within components or shared styles as needed.

## Deployment & Config Notes
- Before shipping, run `npm run lint` and `npm run build`; optionally execute E2E/UI tests if available.
- For GitHub Pages/static hosting, verify `next export` output renders as expected and that generated paths match the configured Pages base URL.
- Reconfirm Cognito settings in `src/config.ts` and validate login/logout flows in the deployed environment, including callback URLs allowed in the User Pool app client.
