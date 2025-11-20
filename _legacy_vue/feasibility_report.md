# Feasibility Report: Converting Petsters to Next.js

## Executive Summary
**Feasibility:** High
**Complexity:** Medium
**Estimated Risk:** Low

The "Petsters" application is a Vue 3 project with a clean separation of concerns, making it a strong candidate for migration to Next.js. The logic is heavily centralized in `services/`, which allows for significant code reuse. The primary effort will be in translating Vue templates to React JSX and adapting the Pixi.js integration to the React lifecycle.

## Key Findings

### 1. Project Structure & Dependencies
- **Current:** Vue 3, Vite, Vue Router.
- **Target:** Next.js (React), App Router.
- **Dependencies:**
  - `pixi.js`: **Compatible.** Can be used in React with `useRef` and `useEffect`.
  - `mitt` (Event Bus): **Compatible**, but a React Context or State Management library (like Zustand) is often preferred for global state in Next.js.
  - `vue-the-mask`: **Incompatible.** Needs replacement (e.g., `react-input-mask`).
  - `fontawesome`: **Compatible.** Has a React equivalent (`@fortawesome/react-fontawesome`).

### 2. Core Components Analysis

#### Map System (`Map.vue`, `MapComponent.vue`, `MapService.js`)
- **Status:** The `MapService` class encapsulates most of the Pixi.js logic, which is excellent.
- **Migration Strategy:**
  - Keep `MapService.js` mostly as-is (logic layer).
  - Replace `document.getElementById` with React `useRef`.
  - Wrap the service initialization in a `useEffect` hook to handle mounting/unmounting.
  - **Challenge:** ensuring Pixi application is properly destroyed to prevent memory leaks during React hot-reloads or navigation.

#### Battle System (`Battle.vue`, `BattleComponent.vue`)
- **Status:** Standard UI components with conditional rendering (`v-if`, `v-else`).
- **Migration Strategy:**
  - Convert Vue templates to JSX.
  - Replace `v-model` with controlled inputs.
  - Move local state (`data()`) to `useState`.

#### Profile & Forms (`Profile.vue`)
- **Status:** Form with validation logic.
- **Migration Strategy:**
  - Convert to React controlled components.
  - Consider using `react-hook-form` for easier validation handling, or manually port the existing validation logic.

### 3. Architecture Changes

#### Routing
- **Vue:** `vue-router` with configuration file.
- **Next.js:** File-system based routing (App Router).
  - `src/views/Login.vue` -> `app/login/page.tsx`
  - `src/views/Profile.vue` -> `app/profile/page.tsx`

#### State Management & Events
- **Current:** `eventBus.js` (Mitt) is used for cross-component communication (e.g., Battle updates, Map movements).
- **Recommendation:** While `mitt` works in React, it is often better to use **React Context** or **Zustand** for shared state to ensure components re-render correctly when data changes.

## Migration Roadmap

1.  **Setup:** Initialize a new Next.js project.
2.  **Port Services:** Copy `services/` folder. Minor adjustments might be needed for `MapService`.
3.  **Port Utilities:** Copy `eventBus.js` (temporarily) or set up a Global Context.
4.  **Component Migration:**
    - Start with "dumb" components (UI only).
    - Move to complex views (`Profile`, `Battle`).
    - Tackle `Map` (Pixi.js) last as it requires careful lifecycle management.
5.  **Routing:** Create the folder structure in `app/`.

## Conclusion
The migration is straightforward due to the good coding practices in the existing Vue app (service layer abstraction). The most complex part will be ensuring the Pixi.js canvas interacts smoothly with React's rendering cycle.
