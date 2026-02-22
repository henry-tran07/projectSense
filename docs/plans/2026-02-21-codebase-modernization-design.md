# projectSense Codebase Modernization Design

**Date:** 2026-02-21
**Branch:** `modernization` (new branch off main)
**Scope:** Improve codebase quality, security, UI, and existing functionality. No new features.

## Context

projectSense is a UIL Number Sense / mental math training platform built in 2023 with Next.js 14, Firebase, Chakra UI + DaisyUI + Tailwind, and Gemini AI. It has received minimal updates. The goal is a balanced modernization across four dimensions while preserving the orange/white color theme and existing feature set.

## Audience

Both UIL Number Sense competitors and general mental math learners.

## 1. UI/UX Overhaul — Modern Minimal

### Color Theme (preserved)
- Primary accent: Orange (`orange-400`/`orange-500`)
- Background: White / light gray
- Text: Gray-900 / Gray-700
- Surfaces: White with subtle borders
- Warm, energetic feel with cleaner execution

### Component Migration
Drop Chakra UI and DaisyUI. Migrate to **Tailwind CSS + shadcn/ui**:
- Modals (Settings, Game, Video) → shadcn Dialog
- Dropdowns → shadcn Select
- Switches → shadcn Switch
- Buttons → shadcn Button (orange variant)
- Inputs → shadcn Input

### Layout Changes
- **Login/Register:** Clean centered card, remove particle background, subtle gradient or plain
- **Home dashboard:** Grid of trick cards (not flat buttons), better visual hierarchy
- **Practice page:** Focused, distraction-free problem view with clear timer
- **Leaderboard:** Clean table with rank/user/time columns and sorting
- **Multiplayer:** Clearer game state indicators and lobby UI

### Typography & Spacing
- Keep Inter font
- Consistent spacing scale via Tailwind
- Larger, more readable problem display

## 2. Security Hardening

### API Key Protection
- Create `app/api/generate-test/route.ts` for server-side Gemini calls
- Rename `NEXT_PUBLIC_GEMINI_API_KEY` → `GEMINI_API_KEY` (server-only)
- testGen page calls internal API route instead of Gemini directly

### Authentication
- Add `middleware.ts` for centralized route protection
- Redirect unauthenticated users from `/home/*`, `/leaderboard`, `/multiplayer`, `/testGen`
- Remove duplicated per-page auth checks

### Input Validation
- Sanitize user answers before processing
- Validate game IDs and trick IDs in dynamic routes
- Rate limiting for AI test generation endpoint

## 3. Code Quality

### TypeScript Migration
- Convert `firebase/config.js` → `firebase/config.ts` with proper types
- Add interfaces: User, Game, LeaderboardEntry, Trick, etc.
- Fix `any` types and missing annotations

### Custom Hooks
- `useAuth()` — auth state, login/logout, current user
- `useSettings()` — user preferences
- `useFirestore()` — shared Firestore patterns
- Extract from components where logic is currently inlined

### Component Cleanup
- Separate logic from presentation
- Consistent file naming and structure
- Remove dead code, unused imports, commented-out blocks

### Error Handling
- Consistent try/catch patterns
- User-facing error messages (not silent failures)
- Proper loading states (skeleton/spinner) for async operations

## 4. Existing Functionality Improvements

### Practice Mode
- Better timer display and answer feedback (correct/incorrect visual cue)
- Smoother question transitions
- Improved end-of-session summary

### Multiplayer
- Handle edge cases (player disconnect, stale game state)
- Clearer lobby UI for waiting/in-progress/ended states
- Better feedback during gameplay

### Leaderboard
- Proper table with rank, user, time columns
- Better loading/empty states
- Smoother data fetching

### AI Test Generator
- Server-side API route (from security section)
- Progress indicator during generation
- Error handling with user-friendly messages
- Cleaner test display and grading results

### General
- Consistent loading states (skeleton loaders, not blank screens)
- Consistent error states with retry options
- Better mobile responsiveness throughout

## Trade-offs

- **Migration effort:** Dropping Chakra/DaisyUI for shadcn/ui is significant but reduces bundle size and eliminates styling conflicts
- **Visual change:** UI will look very different — intentional modernization
- **Incremental approach:** Phased implementation to avoid breaking everything at once
