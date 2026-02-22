# Glassmorphism Visual Redesign

## Problem

Pages have inconsistent visual styles — half use flat `bg-orange-300`, half use `bg-orange-50`. No depth, poor readability, and every page has different navigation patterns.

## Design Direction

Modern glassmorphism: frosted glass effects, translucent cards, rich gradient backgrounds, consistent navigation, improved contrast.

## Design System

### Background
Every page uses the same gradient:
```
bg-gradient-to-br from-orange-400 via-orange-300 to-amber-200
```

### Glass Card
```
bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl
```

### Glass Header (sticky)
```
bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-sm
```

### Glass Buttons
```
bg-white/80 backdrop-blur-sm border border-white/30 shadow-md hover:bg-white/90 hover:shadow-lg
```

### Glass Badge/Pill
```
bg-white/50 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1
```

### Typography on Glass
- Primary text: `text-gray-800` or `text-gray-900`
- Secondary text: `text-gray-600`
- Accent text: `text-orange-600`
- Headers: `text-orange-700 font-bold`

### Consistent Navigation
Every page gets:
- Sticky frosted glass header
- ArrowLeft icon back button (left)
- Page title (center)
- Contextual actions (right)

## Pages

### Login/Register
- Gradient background
- Glass auth card with shadow
- Title with `text-orange-700`
- User Guide link styled as glass pill

### Home
- Glass sticky header and footer
- Glass trick cards in grid
- Glass nav buttons (Random, Multiplayer, AI Test)
- Note text in glass pill

### Practice
- Glass sticky header with back/title/timer
- Trick input area on gradient bg
- Glass results card with per-question breakdown

### Leaderboard
- Glass header with home button and title
- Glass trick selector
- Glass score rows with rank highlighting
- Trophy in gradient accent area

### Multiplayer (all states)
- Glass menu buttons
- Glass lobby card
- Glass progress bars in active game
- Glass game over display

### TestGen (all views)
- Glass generate button
- Glass question cards
- Glass score panel
- Glass answer comparison cards

### 24 Game
- Glass number buttons
- Glass operation buttons
- Glass score/timer display

### Zetamac
- Glass score and timer badges
- Glass input area
- Glass game over card

## Constraints
- Light mode only
- Keep orange theme
- Keep all existing functionality
- Keep shadcn/ui components
- Keep Inter font
