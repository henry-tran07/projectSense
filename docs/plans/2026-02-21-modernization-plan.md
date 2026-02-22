# projectSense Modernization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Modernize projectSense across UI, security, code quality, and existing functionality without adding new features.

**Architecture:** Migrate from Chakra UI + DaisyUI to shadcn/ui + Tailwind. Move Gemini API calls server-side. Extract shared logic into custom hooks. Improve error handling and TypeScript throughout.

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, Firebase, Google Gemini API, TypeScript

**Branch:** `modernization` (off main)

---

## Phase 1: Foundation & Setup

### Task 1: Create branch and install shadcn/ui

**Files:**
- Modify: `package.json`
- Create: `components.json` (shadcn config)
- Create: `lib/utils.ts` (shadcn utility)

**Step 1: Create the modernization branch**

```bash
git checkout -b modernization
```

**Step 2: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

Choose: TypeScript, default style, orange as primary CSS variable, `app/globals.css` for CSS, `@/` alias.

**Step 3: Add required shadcn/ui components**

```bash
npx shadcn@latest add dialog button input switch select dropdown-menu label separator card badge progress skeleton
```

**Step 4: Verify installation**

```bash
npm run build
```

Expected: Build succeeds with new dependencies.

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: initialize shadcn/ui with core components"
```

---

### Task 2: Convert firebase/config.js to TypeScript

**Files:**
- Rename: `firebase/config.js` → `firebase/config.ts`
- Modify: All files that import from `firebase/config`

**Step 1: Create typed firebase config**

Convert `firebase/config.js` to `firebase/config.ts` with proper types:

```typescript
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getDatabase, ref, set, get, update, remove, onValue, Database, DatabaseReference } from "firebase/database";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  databaseURL: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  databaseURL: process.env.FIREBASE_DATABASEURL ?? "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

interface GameSession {
  state: "waiting" | "in_progress" | "ended";
  createdAt: number;
  hostId: string;
  players: Record<string, { questionsSolved: number }>;
  questions: string;
  startTime?: number;
}

// Type all exported functions with proper signatures
export function createGameSession(hostId: string, questionType: string): Promise<string>;
export function joinGameSession(gameId: string, playerId: string): Promise<void>;
export function updatePlayerPosition(gameId: string, odifiedId: string, newPosition: number): Promise<void>;
export function getAvailableGames(): Promise<Record<string, GameSession>>;
export function getGameSession(gameId: string): Promise<GameSession | null>;
export function setQuestions(gameId: string, questions: string): Promise<void>;
export function startGameSession(gameId: string): Promise<void>;
export function endGameSession(gameId: string): Promise<void>;
```

Add the missing `remove` import that currently causes a bug.

**Step 2: Update all imports**

Files to update:
- `app/page.tsx` — `import { auth, db } from "@/firebase/config"`
- `app/register/page.tsx` — same
- `app/home/page.tsx` — same
- `app/home/practice/[id]/page.tsx` — same
- `app/leaderboard/page.tsx` — same
- `app/multiplayer/page.tsx` — same
- `app/components/updateLeaderboard.ts` — same
- `app/components/QuestionCount.tsx` — same

**Step 3: Verify build**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add -A && git commit -m "refactor: convert firebase config to TypeScript with proper types"
```

---

### Task 3: Create shared types and constants

**Files:**
- Create: `app/types/index.ts`

**Step 1: Create type definitions**

```typescript
// app/types/index.ts

export interface UserSettings {
  questionLimited: boolean;
  rightLeft: boolean;
  autoEnter: boolean;
}

export interface LeaderboardEntry {
  email: string;
  time: string;
}

export interface LeaderboardScores {
  [email: string]: string; // email -> time
}

export interface GameSession {
  state: "waiting" | "in_progress" | "ended";
  createdAt: number;
  hostId: string;
  players: Record<string, { questionsSolved: number }>;
  questions: string;
  startTime?: number;
}

export interface ProblemPair {
  body: string;
  ans: string;
}

export interface TrickConfig {
  function: () => ProblemPair;
  probability: number;
  column: number;
  type: string;
}

export interface GradingResult {
  questionNumber: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface GeneratedTest {
  questions: string[];
  answers: string[];
}
```

**Step 2: Commit**

```bash
git add app/types/index.ts && git commit -m "refactor: add shared TypeScript type definitions"
```

---

### Task 4: Create custom hooks

**Files:**
- Create: `app/hooks/useAuth.ts`
- Create: `app/hooks/useSettings.ts`

**Step 1: Create useAuth hook**

```typescript
// app/hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

export function useAuth(redirectTo?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser && redirectTo) {
        router.push(redirectTo);
      }
    });
    return () => unsubscribe();
  }, [redirectTo, router]);

  const logout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return { user, loading, logout };
}
```

**Step 2: Create useSettings hook**

```typescript
// app/hooks/useSettings.ts
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { UserSettings } from "@/app/types";

const DEFAULT_SETTINGS: UserSettings = {
  questionLimited: true,
  rightLeft: false,
  autoEnter: true,
};

export function useSettings(userEmail: string | null) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "users", userEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() as Partial<UserSettings> });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [userEmail]);

  const updateSetting = async (key: keyof UserSettings, value: boolean) => {
    if (!userEmail) return;
    try {
      const docRef = doc(db, "users", userEmail);
      await updateDoc(docRef, { [key]: value });
      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  return { settings, loading, updateSetting };
}
```

**Step 3: Verify build**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add app/hooks/ && git commit -m "refactor: extract useAuth and useSettings custom hooks"
```

---

## Phase 2: Security Hardening

### Task 5: Move Gemini API calls server-side

**Files:**
- Create: `app/api/generate-test/route.ts`
- Create: `app/api/grade-test/route.ts`
- Modify: `app/testGen/page.tsx`
- Modify: `.env.local` (rename key)

**Step 1: Create generate-test API route**

```typescript
// app/api/generate-test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Test generation failed:", error);
    return NextResponse.json({ error: "Failed to generate test" }, { status: 500 });
  }
}
```

**Step 2: Create grade-test API route**

Similar structure for grading endpoint.

**Step 3: Update testGen page to call internal API**

Replace direct Gemini calls with `fetch("/api/generate-test", { method: "POST", body: ... })`.

**Step 4: Update .env.local**

Rename `NEXT_PUBLIC_GEMINI_API_KEY` → `GEMINI_API_KEY` (remove NEXT_PUBLIC_ prefix).

**Step 5: Verify**

```bash
npm run build
```

**Step 6: Commit**

```bash
git add -A && git commit -m "security: move Gemini API calls to server-side API routes"
```

---

### Task 6: Add auth middleware

**Files:**
- Create: `middleware.ts` (project root)

**Step 1: Create middleware**

Note: Firebase Auth tokens are client-side, so middleware will check for auth cookie/token. Since Firebase Auth is purely client-side in this app, we'll use a lightweight approach — set a cookie on login, check it in middleware.

Alternatively, keep client-side auth guards but centralize them via the `useAuth` hook (Task 4) with redirect behavior. This is more practical for a Firebase Auth + Next.js client-component app.

**Step 2: Update all protected pages to use `useAuth("/")`**

Replace inline `onAuthStateChanged` listeners in each page with:

```typescript
const { user, loading } = useAuth("/");
if (loading) return <LoadingSkeleton />;
```

**Step 3: Commit**

```bash
git add -A && git commit -m "security: centralize auth guards via useAuth hook"
```

---

## Phase 3: UI Migration (Chakra/DaisyUI → shadcn/ui)

### Task 7: Migrate SettingsModal

**Files:**
- Rewrite: `app/components/SettingsModal.tsx`

**Step 1: Replace Chakra Modal with shadcn Dialog**

Replace all Chakra imports (`useDisclosure`, `Modal`, `ModalOverlay`, etc.) with shadcn `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`. Replace `Switch` with shadcn `Switch`. Replace `FormControl`/`FormLabel` with shadcn `Label`.

Keep orange accent color. Keep same functionality (right-to-left toggle, infinite questions toggle, sign out, email display).

**Step 2: Verify modal opens/closes correctly**

```bash
npm run dev
```

Test: Open settings, toggle switches, sign out.

**Step 3: Commit**

```bash
git add -A && git commit -m "refactor: migrate SettingsModal from Chakra to shadcn/ui"
```

---

### Task 8: Migrate GameModal and VideoModal

**Files:**
- Rewrite: `app/components/GameModal.tsx`
- Rewrite: `app/components/VideoModal.tsx`

**Step 1: Replace Chakra Modals with shadcn Dialog**

Same pattern as Task 7. Replace all Chakra imports with shadcn equivalents.

**Step 2: Commit**

```bash
git add -A && git commit -m "refactor: migrate GameModal and VideoModal to shadcn/ui"
```

---

### Task 9: Migrate Leaderboard page

**Files:**
- Rewrite: `app/leaderboard/page.tsx`

**Step 1: Replace Chakra Menu with shadcn DropdownMenu or Select**

Replace `Menu`, `MenuButton`, `MenuList`, `MenuItem` with shadcn `Select` / `SelectContent` / `SelectItem`. Remove `ChakraProvider` wrapper.

**Step 2: Redesign table layout**

Clean table with proper columns: Rank, User, Time. Use shadcn Card for container. Add skeleton loading state.

**Step 3: Commit**

```bash
git add -A && git commit -m "refactor: migrate leaderboard from Chakra to shadcn/ui"
```

---

### Task 10: Migrate Home dashboard

**Files:**
- Rewrite: `app/home/page.tsx`

**Step 1: Remove ChakraProvider wrapper**

**Step 2: Redesign trick grid**

Replace flat button list with shadcn Card-based grid. Each trick gets a card with the math expression and a clean hover state. Keep orange accent. Modern minimal layout with proper spacing.

**Step 3: Update navigation buttons**

Replace inline-styled buttons with shadcn Button variants. Settings → shadcn trigger. Game modes → shadcn trigger.

**Step 4: Commit**

```bash
git add -A && git commit -m "refactor: migrate home dashboard to shadcn/ui with card grid"
```

---

### Task 11: Migrate Login and Register pages

**Files:**
- Rewrite: `app/page.tsx`
- Rewrite: `app/register/page.tsx`

**Step 1: Extract shared AuthForm component**

Create `app/components/AuthForm.tsx` with shared login/register form logic. Use shadcn Input, Button, Card, Label. Remove ParticleBackground import (replace with subtle CSS gradient background).

**Step 2: Rewrite login page**

Clean centered card with email/password inputs, Google sign-in button, link to register. Add loading state during auth. Add input validation.

**Step 3: Rewrite register page**

Same card layout with register-specific copy and link back to login.

**Step 4: Commit**

```bash
git add -A && git commit -m "refactor: migrate auth pages to shadcn/ui, extract shared AuthForm"
```

---

### Task 12: Migrate Multiplayer page

**Files:**
- Rewrite: `app/multiplayer/page.tsx`

**Step 1: Replace Chakra Menu with shadcn Select**

**Step 2: Replace DaisyUI progress bar with shadcn Progress**

**Step 3: Break into sub-components**

Extract from the 497-line file:
- `MultiplayerLobby.tsx` — game list, create/join
- `MultiplayerGame.tsx` — active game with timer and progress
- `PlayerProgress.tsx` — individual player progress bar

**Step 4: Improve error handling**

Add try-catch around all Firebase Realtime DB operations. Show user-facing error messages. Handle disconnect gracefully.

**Step 5: Commit**

```bash
git add -A && git commit -m "refactor: migrate multiplayer to shadcn/ui, extract sub-components"
```

---

### Task 13: Migrate TestGen page

**Files:**
- Rewrite: `app/testGen/page.tsx`

**Step 1: Replace spinners-react with shadcn skeleton/loading**

**Step 2: Use shadcn Card, Input, Button for test interface**

**Step 3: Improve loading state**

Show skeleton loader or progress during AI generation instead of a basic spinner. Add error state with retry button.

**Step 4: Commit**

```bash
git add -A && git commit -m "refactor: migrate testGen page to shadcn/ui with better loading states"
```

---

### Task 14: Migrate Practice page

**Files:**
- Rewrite: `app/home/practice/[id]/page.tsx`

**Step 1: Use shadcn Card, Input, Button, Badge for practice UI**

**Step 2: Improve timer display**

Clean, prominent timer with proper formatting. Use Badge component for question counter.

**Step 3: Improve results display**

Replace inline results with a clean card-based summary. Show correct/incorrect with color coding.

**Step 4: Commit**

```bash
git add -A && git commit -m "refactor: migrate practice page to shadcn/ui with improved UX"
```

---

## Phase 4: Cleanup & Polish

### Task 15: Remove Chakra UI and DaisyUI dependencies

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.ts` (remove DaisyUI plugin)
- Delete: Any remaining Chakra/DaisyUI imports

**Step 1: Uninstall packages**

```bash
npm uninstall @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled daisyui spinners-react react-particles tsparticles-engine tsparticles-slim
```

**Step 2: Remove DaisyUI from tailwind config**

**Step 3: Remove ParticleBackground component**

Delete `app/components/ParticleBackground.tsx` if no longer used.

**Step 4: Verify build**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add -A && git commit -m "chore: remove Chakra UI, DaisyUI, and particle dependencies"
```

---

### Task 16: Update globals.css and Tailwind theme

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

**Step 1: Set up CSS variables for orange theme**

Ensure shadcn/ui CSS variables use orange as primary accent. Set up proper light theme with orange-400/500 as primary.

**Step 2: Keep existing custom animations**

Preserve `fadeInShrink`, `slideUp`, `shine` keyframes.

**Step 3: Commit**

```bash
git add -A && git commit -m "style: update theme with orange accent CSS variables"
```

---

### Task 17: Improve error handling across all pages

**Files:**
- Modify: All page files
- Modify: `app/components/QuestionCount.tsx`
- Modify: `app/components/updateLeaderboard.ts`

**Step 1: Add user-facing error messages**

Replace silent `console.error` calls with state-based error display. Add try-catch with meaningful messages.

**Step 2: Add loading skeletons**

Replace blank loading states with shadcn Skeleton components on all pages.

**Step 3: Fix QuestionCount silent errors**

Add proper error handling to `updateAnsweredQuestions` and `updateGeneratedQuestions`.

**Step 4: Commit**

```bash
git add -A && git commit -m "fix: add proper error handling and loading states across all pages"
```

---

### Task 18: Fix known bugs and code quality issues

**Files:**
- Modify: `app/components/Trick.tsx` (line 53 parameter mutation)
- Modify: `app/multiplayer/page.tsx` (listener cleanup)
- Modify: `app/home/practice/[id]/page.tsx` (useEffect dependencies)

**Step 1: Fix Trick.tsx parameter mutation**

Replace `trick = String(...)` with a local variable.

**Step 2: Fix useEffect dependency arrays**

Audit and fix missing dependencies in practice page useEffects.

**Step 3: Add proper listener cleanup in multiplayer**

Ensure all Firebase `onValue` listeners are cleaned up on unmount.

**Step 4: Commit**

```bash
git add -A && git commit -m "fix: resolve parameter mutation, missing deps, and listener cleanup bugs"
```

---

### Task 19: Final build verification and cleanup

**Files:**
- All files

**Step 1: Run full build**

```bash
npm run build
```

**Step 2: Run lint**

```bash
npm run lint
```

**Step 3: Fix any remaining issues**

**Step 4: Run format**

```bash
npm run format
```

**Step 5: Final commit**

```bash
git add -A && git commit -m "chore: final cleanup, lint fixes, and formatting"
```

---

## Task Dependency Order

```
Phase 1 (Foundation):  Task 1 → Task 2 → Task 3 → Task 4
Phase 2 (Security):    Task 5 → Task 6
Phase 3 (UI):          Task 7 → Task 8 → Task 9 → Task 10 → Task 11 → Task 12 → Task 13 → Task 14
Phase 4 (Cleanup):     Task 15 → Task 16 → Task 17 → Task 18 → Task 19
```

Phase 1 must complete before Phase 3 (shadcn/ui needed).
Phase 2 can run in parallel with Phase 3.
Phase 4 runs after all others.
