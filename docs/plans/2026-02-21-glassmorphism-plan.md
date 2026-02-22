# Glassmorphism Visual Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign all pages with modern glassmorphism — frosted glass cards, rich gradient backgrounds, consistent navigation, and improved readability — while keeping the orange theme and all existing functionality.

**Architecture:** Pure visual changes across ~15 files. Add shared Tailwind utility classes in globals.css for glass effects, then apply them page by page. No logic changes, no new dependencies, no tests needed.

**Tech Stack:** Tailwind CSS, shadcn/ui, Next.js

---

## Task 1: Add Glass Utility Classes to globals.css

**Files:**
- Modify: `app/globals.css`

**Step 1: Add glass utility classes after the existing `@layer base` block**

Add these reusable utility classes inside a `@layer components` block:

```css
@layer components {
  .glass-card {
    @apply bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl;
  }
  .glass-header {
    @apply bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-sm;
  }
  .glass-button {
    @apply bg-white/80 backdrop-blur-sm border border-white/30 shadow-md hover:bg-white/90 hover:shadow-lg transition-all duration-200;
  }
  .glass-pill {
    @apply bg-white/50 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1;
  }
  .page-gradient {
    @apply bg-gradient-to-br from-orange-400 via-orange-300 to-amber-200 min-h-screen;
  }
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: add glassmorphism utility classes to globals.css"
```

---

## Task 2: Redesign Login Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace the entire return JSX**

Change background from `bg-gradient-to-br from-orange-50 to-orange-100` to `page-gradient`.

Change the User Guide button to use glass-pill styling.

Change the hero text colors from `text-orange-400` to `text-white` with a text shadow.

Change subtitle from `text-gray-600` to `text-white/80`.

```tsx
return (
  <main className="page-gradient w-full">
    {/* User Guide link */}
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={() => {
          window.open("https://project-sense.vercel.app/manual.pdf");
        }}
        className="glass-pill flex items-center gap-2 text-orange-700 hover:text-orange-800 font-bold text-sm font-sans transition-colors"
      >
        User Guide
        <MdMenuBook className="text-xl" />
      </button>
    </div>

    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side: Hero */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-12 md:py-0">
        <h1 className="font-sans text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
          Project Sense
        </h1>
        <p className="mt-3 text-base md:text-lg text-white/80 text-center max-w-md">
          Your go-to platform for mastering mental math and number sense
        </p>
      </div>

      {/* Right side: Auth form */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-6 pb-12 md:py-0">
        <AuthForm
          mode="login"
          onSubmit={onSubmit}
          onGoogleSignIn={handleGoogleSignIn}
          error={error}
        />
      </div>
    </div>
  </main>
);
```

**Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "style: glassmorphism login page"
```

---

## Task 3: Redesign Register Page

**Files:**
- Modify: `app/register/page.tsx`

**Step 1: Apply identical changes as login page**

Same pattern — `page-gradient` background, glass-pill User Guide, white hero text.

```tsx
return (
  <main className="page-gradient w-full">
    {/* User Guide link */}
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={() => {
          window.open("https://project-sense.vercel.app/manual.pdf");
        }}
        className="glass-pill flex items-center gap-2 text-orange-700 hover:text-orange-800 font-bold text-sm font-sans transition-colors"
      >
        User Guide
        <MdMenuBook className="text-xl" />
      </button>
    </div>

    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side: Hero */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-12 md:py-0">
        <h1 className="font-sans text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
          Project Sense
        </h1>
        <p className="mt-3 text-base md:text-lg text-white/80 text-center max-w-md">
          Your go-to platform for mastering mental math and number sense
        </p>
      </div>

      {/* Right side: Auth form */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-6 pb-12 md:py-0">
        <AuthForm
          mode="register"
          onSubmit={onSubmit}
          onGoogleSignIn={handleGoogleSignIn}
          error={error}
        />
      </div>
    </div>
  </main>
);
```

**Step 2: Commit**

```bash
git add app/register/page.tsx
git commit -m "style: glassmorphism register page"
```

---

## Task 4: Redesign AuthForm Component

**Files:**
- Modify: `app/components/AuthForm.tsx`

**Step 1: Make the Card use glass styling**

Change the Card className from `w-full max-w-md border-0 shadow-lg` to `glass-card w-full max-w-md`.

Change the title to `text-orange-700`.

Change the submit button from `bg-orange-400 hover:bg-orange-500` to `bg-orange-500 hover:bg-orange-600 shadow-lg`.

**Step 2: Commit**

```bash
git add app/components/AuthForm.tsx
git commit -m "style: glassmorphism auth form"
```

---

## Task 5: Redesign Home Page

**Files:**
- Modify: `app/home/page.tsx`

**Step 1: Update the main container**

Change `bg-orange-50` to `page-gradient` in both the loading skeleton and the main return.

**Step 2: Update the header**

Change `bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm` to `glass-header`.

Change trophy button from `bg-orange-400 text-white hover:bg-orange-500` to `bg-white/80 text-orange-600 hover:bg-white hover:text-orange-700 shadow-md`.

Change title from `text-orange-400` to `text-white drop-shadow-md`.

**Step 3: Update the info note**

Wrap in glass-pill: `<p className="glass-pill text-orange-700 font-medium text-sm md:text-base text-center mx-auto mt-3 w-fit">`.

**Step 4: Update nav buttons**

Change border/text styles: `glass-button rounded-xl text-orange-700 font-semibold text-base md:text-lg px-4 md:px-8 py-2 md:py-5`.

**Step 5: Update trick cards**

Change Card from `border-orange-100 bg-white hover:shadow-lg hover:border-orange-300` to `glass-card hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200`.

Change the `?` video button from `bg-orange-400` to `bg-orange-500/80 hover:bg-orange-600/80`.

**Step 6: Update footer**

Change `bg-white/95 backdrop-blur-sm border-t border-orange-100` to `glass-header border-t border-b-0`.

Change text from `text-orange-400` to `text-orange-700`.

**Step 7: Commit**

```bash
git add app/home/page.tsx
git commit -m "style: glassmorphism home page"
```

---

## Task 6: Redesign Practice Page

**Files:**
- Modify: `app/home/practice/[id]/page.tsx`

**Step 1: Update main container and loading state**

Change `bg-orange-50` to `page-gradient`.

**Step 2: Update sticky header**

Change `bg-white border-b shadow-sm` to `glass-header`.

Change back button hover: `hover:bg-white/40`.

Change title from `text-orange-500` to `text-white drop-shadow-md`.

Change badges from `bg-orange-100 text-orange-600` to `glass-pill text-orange-700 font-semibold`.

**Step 3: Update results card**

Change Card to `glass-card` with `shadow-2xl`.

Change Trophy icon to `text-orange-600`.

Change title from `text-orange-500` to `text-orange-700`.

Change restart button to use `glass-button`.

**Step 4: Commit**

```bash
git add app/home/practice/[id]/page.tsx
git commit -m "style: glassmorphism practice page"
```

---

## Task 7: Redesign Trick Component Input Area

**Files:**
- Modify: `app/components/Trick.tsx`

**Step 1: Update the input styling**

Change the input className from `bg-orange-300` to `bg-white/20 backdrop-blur-sm`.

Change the text color from `text-white` (inherited) to explicit `text-white`.

Change `border-b-2` to `border-b-2 border-white/60`.

**Step 2: Commit**

```bash
git add app/components/Trick.tsx
git commit -m "style: glassmorphism trick input"
```

---

## Task 8: Redesign Leaderboard Page

**Files:**
- Modify: `app/leaderboard/page.tsx`

**Step 1: Update main container**

Change `bg-orange-300` to `page-gradient`.

**Step 2: Update header**

Replace the current header div with a glass-header:

```tsx
<header className="glass-header sticky top-0 z-10 w-full">
  <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.push("/home")}
      className="text-orange-700 hover:bg-white/40"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
    <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">Leaderboards</h1>
    <div className="w-10" />
  </div>
</header>
```

(Add ArrowLeft to imports from lucide-react)

**Step 3: Update trick selector**

Add glass styling to SelectTrigger: `glass-card px-4 py-2 text-orange-700`.

**Step 4: Update trophy**

Change from `text-white` to `text-white/90 drop-shadow-lg`.

**Step 5: Update score rows**

Replace each score row with glass styling:

```tsx
<Card className="my-1.5 w-[90%] md:w-[80%] glass-card">
  <CardContent className="p-0">
    <div className="gap-x-2 md:gap-x-4 text-lg md:text-2xl flex flex-row items-center justify-between">
      <p className="bg-orange-500/20 px-4 text-orange-700 py-2 md:py-3 rounded-2xl font-bold text-center md:w-[4.1rem]">
        {index + 1}
      </p>
      <p className="text-gray-800 py-2 md:py-3 font-bold text-center flex-grow">
        {email.substring(0, email.indexOf("@"))}
      </p>
      <p className="bg-orange-500/20 px-2 md:px-4 text-orange-700 py-2 md:py-3 rounded-2xl font-bold text-center w-fit font-mono">
        {time}
      </p>
    </div>
  </CardContent>
</Card>
```

**Step 6: Update loading skeleton**

Change skeleton `bg-white/40` to `bg-white/30`.

**Step 7: Update empty state**

Change Card to `glass-card` and text to `text-orange-700`.

**Step 8: Commit**

```bash
git add app/leaderboard/page.tsx
git commit -m "style: glassmorphism leaderboard page"
```

---

## Task 9: Redesign Multiplayer Page + Components

**Files:**
- Modify: `app/multiplayer/page.tsx`
- Modify: `app/multiplayer/components/MultiplayerMenu.tsx`
- Modify: `app/multiplayer/components/LobbySelect.tsx`
- Modify: `app/multiplayer/components/GameLobby.tsx`
- Modify: `app/multiplayer/components/ActiveGame.tsx`
- Modify: `app/multiplayer/components/GameOver.tsx`

### Step 1: Update multiplayer page.tsx

Change `bg-orange-300` (in loading, main container) to `page-gradient`.

Change the Project Sense home button from `bg-white text-orange-300` to a glass back button:

```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={() => router.push("/home")}
  className="absolute top-4 left-4 glass-button rounded-full h-10 w-10 text-orange-700"
>
  <ArrowLeft className="h-5 w-5" />
</Button>
```

(Add ArrowLeft from lucide-react, can remove the font-extrabold text-based home button)

### Step 2: Update MultiplayerMenu.tsx

Change button text from plain `text-white` to styled glass buttons:

```tsx
return (
  <div className="gap-y-6 font-mono items-center justify-center flex flex-col fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-auto">
    <button className="glass-card px-8 py-6 text-orange-700 text-4xl md:text-7xl font-extrabold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full text-center" onClick={onFindGame}>
      FIND GAME
    </button>
    <button className="glass-card px-8 py-6 text-orange-700 text-4xl md:text-7xl font-extrabold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full text-center" onClick={onCreateGame}>
      CREATE GAME
    </button>
  </div>
);
```

### Step 3: Update LobbySelect.tsx

Change back button to glass style:

```tsx
<Button
  variant="ghost"
  onClick={onBack}
  className="mt-16 md:mt-24 glass-button rounded-2xl text-orange-700 text-2xl md:text-4xl font-extrabold ml-3 md:ml-8 px-4 h-auto"
>
  <ArrowLeft className="h-6 w-6" />
</Button>
```

Change title from `text-white` to `text-white drop-shadow-lg`.

Change lobby Card from `bg-white border-8 border-orange-500` to `glass-card border-2 border-white/30`.

Change refresh button text to `text-orange-700`.

Change game links to `text-orange-700 hover:text-orange-800`.

### Step 4: Update GameLobby.tsx

Same back button pattern as LobbySelect.

Change lobby title from `text-white` to `text-white drop-shadow-lg`.

Change lobby Card from `bg-white border-8 border-orange-500` to `glass-card border-2 border-white/30`.

Change action buttons from `bg-white text-orange-300` to `glass-button text-orange-700 rounded-xl`.

Change player text to `text-gray-800`.

### Step 5: Update ActiveGame.tsx

Same back button pattern.

Change timer from `text-white` to `text-white drop-shadow-lg`.

Change input `bg-orange-300` to `bg-white/20 backdrop-blur-sm`.

Change progress bars `bg-orange-100` to `bg-white/30`.

Change player labels from `text-slate-100` to `text-white font-bold drop-shadow-sm`.

### Step 6: Update GameOver.tsx

Same back button pattern.

Change winner text from `text-white` to `text-white drop-shadow-lg`.

Add a glass-card wrapper around the winner announcement.

### Step 7: Commit

```bash
git add app/multiplayer/page.tsx app/multiplayer/components/
git commit -m "style: glassmorphism multiplayer pages"
```

---

## Task 10: Redesign TestGen Page

**Files:**
- Modify: `app/testGen/page.tsx`

**Step 1: Update all backgrounds**

Change every `bg-orange-300` to `page-gradient`.

**Step 2: Update back buttons**

Change `text-white hover:bg-orange-400` to `glass-button text-orange-700 rounded-xl`.

**Step 3: Update generate button**

Change from `bg-white text-orange-400` to `glass-card text-orange-700 text-2xl md:text-4xl font-bold py-6 px-8 md:py-8 md:px-12 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`.

**Step 4: Update loading cards**

Change `bg-orange-400/50 border-orange-200` to `glass-card`.

Change spinner/text from `text-white` to `text-orange-700`.

**Step 5: Update test view header**

Change sticky header from `bg-orange-300 border-b border-orange-400` to `glass-header`.

Change title from `text-white` to `text-white drop-shadow-md`.

Change subtitle from `text-orange-100` to `text-white/70`.

**Step 6: Update question cards**

Change `bg-white/95 border-orange-200` to `glass-card`.

**Step 7: Update submit button bar**

Change `bg-orange-300 border-t border-orange-400` to `glass-header border-t border-b-0`.

Change submit button to glass styling.

**Step 8: Update results view**

Change results header from `border-b-2 border-white` to `glass-header`.

Change score panel from `bg-orange-400/80 border-orange-200` to `glass-card bg-orange-500/30`.

Change score text from `text-white` to `text-orange-700`.

Change answer cards from `bg-white/90 border-orange-200` to `glass-card`.

**Step 9: Commit**

```bash
git add app/testGen/page.tsx
git commit -m "style: glassmorphism test generator page"
```

---

## Task 11: Redesign 24 Game Page

**Files:**
- Modify: `app/twenty-four/page.tsx`
- Modify: `app/twenty-four/TimerComponent.tsx`

**Step 1: Update page background**

Change `bg-orange-300` to `page-gradient`.

**Step 2: Update home button**

Replace `⌂` button with ArrowLeft glass button:

```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={async () => {
    await Promise.all([router.prefetch("/home"), router.push("/home")]);
  }}
  className="absolute left-3 top-4 glass-button rounded-full h-10 w-10 text-orange-700"
>
  <ArrowLeft className="h-5 w-5" />
</Button>
```

(Add ArrowLeft, Button imports)

**Step 3: Update title**

Change from `text-white underline` to `text-white drop-shadow-lg` (remove underline).

**Step 4: Update number buttons**

Change from `bg-white text-black shadow-lg` to `glass-card text-gray-800 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200`.

Change selected state from `bg-gray-700 text-white` to `bg-orange-500/80 text-white backdrop-blur-xl shadow-2xl`.

**Step 5: Update operation buttons**

Change from `bg-white border-black border-4 text-black` to `glass-card text-gray-800 border-2 border-white/40`.

Change selected state from `bg-gray-700 text-white` to `bg-orange-500/80 text-white`.

**Step 6: Update restart and skip buttons**

Change from `bg-white border-black border-4` to `glass-button border-2 border-white/40 rounded-3xl`.

**Step 7: Update TimerComponent.tsx**

Change text from `text-white` to `text-white drop-shadow-md`.

**Step 8: Commit**

```bash
git add app/twenty-four/page.tsx app/twenty-four/TimerComponent.tsx
git commit -m "style: glassmorphism 24 game"
```

---

## Task 12: Redesign Zetamac Page

**Files:**
- Modify: `app/zetamac/page.tsx`

**Step 1: Update background**

Change `bg-orange-300` to `page-gradient`.

**Step 2: Update title and score**

Change `text-white underline` to `text-white drop-shadow-lg` (remove underline).

Change score text to `text-white drop-shadow-sm`.

**Step 3: Update game over section**

Wrap in a glass-card:

```tsx
<div className="glass-card p-8 flex flex-col items-center gap-4">
  <h2 className="text-4xl font-bold text-orange-700">Game Over</h2>
  <p className="text-2xl text-gray-800">Your Score: {score}</p>
  <Highscore highscore={highscore} />
  <button
    onClick={handlePlayAgain}
    className="glass-button font-semibold mt-4 px-8 py-4 text-orange-700 rounded-xl text-lg"
  >
    Play Again
  </button>
</div>
```

**Step 4: Update Highscore component**

Change `text-white` to `text-orange-600`.

**Step 5: Update active game input**

Change `border-b border-white bg-transparent` to `border-b-2 border-white/60 bg-white/10 backdrop-blur-sm`.

**Step 6: Update timer text**

Change `text-white underline` to use a glass-pill: `glass-pill text-orange-700 font-semibold`.

**Step 7: Commit**

```bash
git add app/zetamac/page.tsx
git commit -m "style: glassmorphism zetamac page"
```

---

## Task 13: Redesign Modal Components

**Files:**
- Modify: `app/components/SettingsModal.tsx`
- Modify: `app/components/VideoModal.tsx`
- Modify: `app/components/GameModal.tsx`

### Step 1: SettingsModal

Change DialogContent from `bg-white p-6 shadow-xl` to `glass-card p-6 bg-white/80`.

Change title from `text-orange-500` to `text-orange-700`.

### Step 2: VideoModal

Change the `?` trigger button from `bg-orange-400` to `bg-orange-500/80 hover:bg-orange-600/80`.

Change DialogContent to add `glass-card overflow-hidden`.

Change title from `text-orange-500` to `text-orange-700`.

### Step 3: GameModal

Change DialogContent from `bg-orange-400 border-none` to `glass-card bg-orange-500/40 border-white/20`.

Change title from `text-white` to `text-orange-700`.

Change game buttons from `bg-white text-orange-400` to `glass-button text-orange-700`.

### Step 4: Commit

```bash
git add app/components/SettingsModal.tsx app/components/VideoModal.tsx app/components/GameModal.tsx
git commit -m "style: glassmorphism modal components"
```

---

## Task 14: Final Polish and Verification

**Step 1: Run dev server and visually verify all pages**

```bash
npm run dev
```

Visit each page and verify:
- [ ] Login (`/`)
- [ ] Register (`/register`)
- [ ] Home (`/home`)
- [ ] Practice (`/home/practice/1`)
- [ ] Leaderboard (`/leaderboard`)
- [ ] Multiplayer (`/multiplayer`)
- [ ] TestGen (`/testGen`)
- [ ] 24 Game (`/twenty-four`)
- [ ] Zetamac (`/zetamac`)

**Step 2: Fix any visual inconsistencies found**

**Step 3: Run build to check for errors**

```bash
npm run build
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "style: final glassmorphism polish and fixes"
```
