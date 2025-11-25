# Phase 9 – BFF Authentication Enablement

## Goals
- Turn on the new BFF-driven authentication flow for GitHub Pages deployments.
- Document how the SPA relies on the Flask layer for PKCE and session cookies.
- Confirm protected views and logout UX are wired through the shared auth context.

## Changes
- Enabled login flows by default so the SPA always uses the BFF endpoints for native and social providers. (see `src/config.ts`).
- Recorded the authentication surface area for future operators:
  - `src/services/AuthService.ts` coordinates PKCE redirects, native sign-in/sign-up, and session lookups against the Flask API.
  - `src/components/auth/AuthProvider.tsx` and `src/components/auth/AuthGuard.tsx` gate protected routes (battle, map, gyms, party, profile) and hydrate user state from the BFF session cookie.
  - `src/app/login/page.tsx` and `src/app/signup/page.tsx` expose native email/password flows plus Google/Discord buttons that hand off to the BFF.
  - `src/app/auth/callback/page.tsx` finalizes the authorization code exchange before redirecting visitors back to their intended page.
  - `src/components/Header.tsx` surfaces the authenticated user label and right-aligned logout control calling the BFF.

## Files Touched
- `src/config.ts` – login is now enabled by default to rely on the BFF session model.
- Documentation references: `src/services/AuthService.ts`, `src/components/auth/AuthProvider.tsx`, `src/components/auth/AuthGuard.tsx`, `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/app/auth/callback/page.tsx`, `src/components/Header.tsx`.

## Deployment & Config Notes
- Set `apiBaseUrl`/`bffBaseUrl` in `src/config.ts` to the Flask BFF host that fronts Cognito; the SPA always calls the BFF with `credentials: 'include'`.
- Add the SPA origin and `/auth/callback` path to your Cognito app client callback/allowed URLs.
- For GitHub Pages, ensure the BFF domain is accessible from the published static site and that CORS is configured to allow cookies.
