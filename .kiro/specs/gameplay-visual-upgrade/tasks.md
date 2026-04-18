# Implementation Plan: Gameplay Visual Upgrade

## Overview

This plan implements four independently deployable phases of gameplay, visual, utility, and accessibility features for PixelPets. Each phase builds incrementally, with property-based tests validating correctness properties from the design. The central `useGameState` hook is established first, then each phase layers on top.

## Tasks

- [x] 1. Create `useGameState` hook and XP/Level system
  - [x] 1.1 Create `src/hooks/useGameState.ts` with the `GameState` interface and localStorage persistence
    - Define `PersistedGameState` interface with xp, level, accessories, achievements, counts, pomodoroConfig, locale, nightModeManualOverride
    - Implement localStorage read on mount (key: `pixelpets-game-v1`) with try/catch fallback to defaults
    - Implement write-on-mutate for all state changes
    - Export `useGameState()` hook returning state + action functions (addXp, equipAccessory, unlockAchievement, incrementFeedCount, incrementPlayCount, incrementClickCount, setLocale)
    - _Requirements: 1.5, 1.6, 2.1, 2.4, 4.1, 4.2_

  - [x] 1.2 Implement `calculateLevel(xp)` as a pure exported function and wire it into `addXp()`
    - Formula: `Math.floor(Math.sqrt(xp / 100)) + 1`
    - `addXp()` should recalculate level and detect level-up transitions
    - _Requirements: 2.1, 2.2_

  - [ ]* 1.3 Write property test: Level calculation is deterministic and monotonic (Property 1)
    - **Property 1: Level calculation is deterministic and monotonic**
    - Generate random XP values [0, 100000], verify formula output and that xp1 ≤ xp2 implies level1 ≤ level2
    - **Validates: Requirements 2.1**

  - [ ]* 1.4 Write property test: Game state serialization round-trip (Property 4)
    - **Property 4: Game state serialization round-trip**
    - Generate random valid `PersistedGameState` objects, serialize to JSON, deserialize, verify equality
    - **Validates: Requirements 1.5, 4.1, 4.2, 9.4**

  - [x] 1.5 Integrate XP awards into Pet.tsx actions (feed, play, click)
    - Wire `useGameState` into the index route and pass `addXp` / increment functions to Pet via actionRef or props
    - Feed → 5 XP + incrementFeedCount, Play → 8 XP + incrementPlayCount, Click → 2 XP + incrementClickCount
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.6 Add level-up effects to Pet.tsx
    - Detect level change from `useGameState` and trigger jump state, "happy" sound, and "Level N!" speech bubble for 2500ms
    - _Requirements: 2.2, 2.3_

  - [x] 1.7 Add XP/Level display to StatsPanel
    - Show current level number and XP progress bar toward next level threshold
    - _Requirements: 2.5_

- [x] 2. Implement Accessory system
  - [x] 2.1 Create `src/components/pets/accessories.ts` with accessory definitions
    - Define `AccessoryDef` interface with id, name (en/pt), slot, unlockLevel, render function
    - Define all accessories: basic-hat (L2), glasses (L3), bow (L5), scarf (L7), cape (L10), pajamas (L0)
    - Each render function returns SVG `<g>` elements positioned relative to 32×32 viewBox
    - _Requirements: 3.1, 3.7_

  - [x] 2.2 Create `src/components/pets/AccessoryRenderer.tsx`
    - Accept equipped accessories map, facing direction, petSize, and petState
    - Render SVG `<g>` overlays for each equipped slot
    - Apply `transform="scale(-1,1)"` when facing left
    - Apply faint-state rotation/opacity transforms matching Pet.tsx
    - _Requirements: 3.2, 3.4, 3.5, 3.6_

  - [ ]* 2.3 Write property test: Accessory mirroring matches pet facing (Property 5)
    - **Property 5: Accessory mirroring matches pet facing**
    - Generate random (accessory, facing) pairs, verify horizontal flip transform is applied iff facing === "left"
    - **Validates: Requirements 3.4**

  - [ ]* 2.4 Write property test: One accessory per slot invariant (Property 6)
    - **Property 6: One accessory per slot invariant**
    - Generate random sequences of equipAccessory operations, verify each slot contains at most one accessory
    - **Validates: Requirements 3.5**

  - [ ]* 2.5 Write property test: Level-based accessory unlocking is monotonic (Property 7)
    - **Property 7: Level-based accessory unlocking is monotonic**
    - Generate random level pairs L1 ≤ L2, verify unlocked set at L2 is superset of set at L1
    - **Validates: Requirements 3.7**

  - [ ]* 2.6 Write property test: Locked accessories are filtered on load (Property 8)
    - **Property 8: Locked accessories are filtered on load**
    - Generate random persisted configs with mixed lock states and current levels, verify locked items are nulled out
    - **Validates: Requirements 4.3**

  - [x] 2.7 Add accessory selection UI to ControlPanel
    - Display unlocked accessories as selectable buttons grouped by slot
    - Show locked accessories grayed-out with required level label
    - Wire equip/unequip to `useGameState.equipAccessory()`
    - _Requirements: 3.3, 3.8_

  - [x] 2.8 Integrate AccessoryRenderer into Pet.tsx
    - Render `<AccessoryRenderer>` inside the pet container div, layered on top of the sprite
    - Pass equipped accessories from `useGameState`, facing, petSize, and current petState
    - _Requirements: 3.2, 3.6_

- [x] 3. Implement Particle Effects and Night Mode
  - [x] 3.1 Create `src/components/pets/ParticleSystem.tsx`
    - Accept array of `ParticleConfig` objects (type, count, duration, origin)
    - Render absolutely-positioned SVG elements with CSS keyframe animations
    - Remove particles from DOM after animation completes via `onAnimationEnd` or `setTimeout`
    - Support particle types: stars (6-10 particles, 400ms), food (4-6 particles, 500ms), confetti (12-16 particles, 800ms)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 3.2 Wire ParticleSystem into Pet.tsx
    - Emit star particles on jump state
    - Emit food particles on feed action
    - Emit confetti particles on level-up
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 3.3 Implement Night Mode logic in Pet.tsx
    - Add `useEffect` reading `awareness.timeOfDay`
    - Auto-equip pajamas in special slot when timeOfDay === "night"
    - Auto-unequip when transitioning from night to morning
    - Respect `nightModeManualOverride` flag — skip auto-equip if player manually set special slot
    - Show "zzz... pijama time" speech bubble for 2000ms on auto-equip
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 4. Checkpoint — Phase 1 complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Catch Game
  - [x] 5.1 Create `src/components/games/CatchGame.tsx`
    - Render falling emoji objects within a bounded game area overlay
    - Use `requestAnimationFrame` for smooth falling animation
    - Spawn one object every 1200ms for 30 seconds
    - Click detection via event delegation on game container
    - Increment score on hit, play "coin" sound
    - Display final score on completion, call `onComplete(score)`
    - No penalty for clicking outside objects
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 5.2 Wire CatchGame into ControlPanel and Pet.tsx
    - Add "Catch Game" button to ControlPanel
    - Pause pet movement (idle state) while game is active
    - Award XP = score × 3 (capped at 50) via `addXp()`
    - _Requirements: 7.4, 7.6_

  - [ ]* 5.3 Write property test: Mini-game XP is always clamped to [10, 50] (Property 2)
    - **Property 2: Mini-game XP is always clamped to [10, 50]**
    - Generate random scores [0, 1000], verify XP awarded is within [10, 50]
    - **Validates: Requirements 1.4**

- [x] 6. Implement Memory Game
  - [x] 6.1 Create `src/components/games/MemoryGame.tsx`
    - Render 4×3 grid of face-down card buttons using pet emoji as pairs (6 unique × 2)
    - Flip animation via CSS transforms on click
    - Compare two revealed cards: match → keep face-up + "happy" sound; no match → flip back after 800ms
    - Track attempt count, call `onComplete(attempts)` when all pairs matched
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 6.2 Wire MemoryGame into ControlPanel and XP system
    - Add "Memory Game" button to ControlPanel
    - Award XP based on attempts: <10 → 50 XP, 10-15 → 30 XP, >15 → 15 XP
    - _Requirements: 8.4_

  - [ ]* 6.3 Write property test: Memory game XP tiers are correctly partitioned (Property 3)
    - **Property 3: Memory game XP tiers are correctly partitioned**
    - Generate random attempt counts [0, 100], verify tier boundaries produce exactly 50, 30, or 15 XP
    - **Validates: Requirements 8.4**

- [x] 7. Implement Achievement System
  - [x] 7.1 Create achievement definitions and tracking logic in `useGameState`
    - Define `AchievementDef` array with all 10 milestones: Fed 10, Fed 100, Played 50, Level 5, Level 10, Survived critical battery, Played all mini-games, Equipped first accessory, Night owl, Clicked 500
    - Check conditions reactively on each state mutation (addXp, incrementFeedCount, etc.)
    - Unlock achievement only on first occurrence
    - _Requirements: 9.1, 9.4_

  - [x] 7.2 Create `src/components/AchievementToast.tsx`
    - Display toast notification with achievement name and icon for 3000ms
    - Play "coin" sound on display
    - Use absolutely-positioned div with fade-in/out animation
    - _Requirements: 9.2, 9.3_

  - [x] 7.3 Add achievements section to ControlPanel
    - Display all achievements with unlocked ones showing icon/name
    - Show locked achievements as grayed-out silhouettes
    - Show total unlocked count
    - _Requirements: 9.5, 9.6_

- [x] 8. Checkpoint — Phase 2 complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement Multiple Simultaneous Pets
  - [x] 9.1 Modify `index.tsx` route to support multi-pet management
    - Change `onAddPet` to push to pets array instead of replacing (cap at 5)
    - Track most recently clicked pet for StatsPanel display
    - Update Electron overlay to render multiple pets
    - _Requirements: 10.1, 10.5, 10.6_

  - [x] 9.2 Implement pet interaction detection
    - Add `useEffect` with 1-second interval checking pairwise distances
    - Trigger interaction (speech bubbles + 3 happiness) when distance < 80px
    - Maintain cooldown map (pet-pair key → timestamp) with 10-second cooldown
    - _Requirements: 10.2, 10.3_

  - [x] 9.3 Implement non-overlapping spawn logic
    - When adding a new pet, calculate spawn position with minimum `petSize` distance from all existing pets
    - Retry random positions until valid placement found (with max attempts fallback)
    - _Requirements: 10.4_

  - [ ]* 9.4 Write property test: Pet count never exceeds 5 (Property 9)
    - **Property 9: Pet count never exceeds 5**
    - Generate random sequences of add-pet operations from any initial list (0-5 pets), verify count ≤ 5
    - **Validates: Requirements 10.1**

  - [ ]* 9.5 Write property test: Pet interaction triggers iff within distance threshold (Property 10)
    - **Property 10: Pet interaction triggers iff within distance threshold**
    - Generate random position pairs, verify interaction check returns true iff Euclidean distance < 80px
    - **Validates: Requirements 10.2**

  - [ ]* 9.6 Write property test: New pet spawn does not overlap existing pets (Property 11)
    - **Property 11: New pet spawn does not overlap existing pets**
    - Generate random sets of 1-4 existing positions, verify new spawn has center-to-center distance ≥ petSize from all
    - **Validates: Requirements 10.4**

- [x] 10. Implement Pomodoro Timer
  - [x] 10.1 Create `src/components/PomodoroTimer.tsx`
    - Implement work/break/idle state machine with `setInterval` (1-second tick)
    - Configurable durations: work (15/25/45 min), break (5/10/15 min) from `useGameState.pomodoroConfig`
    - Display current phase and remaining time in MM:SS format
    - Trigger pet speech bubbles: "Break time! 🍅" + "happy" sound on work end, "Back to work! 💪" + "click" sound on break end
    - Support stop/reset
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

  - [ ]* 10.2 Write property test: Time formatting produces valid MM:SS (Property 12)
    - **Property 12: Time formatting produces valid MM:SS**
    - Generate random non-negative seconds [0, 86400], verify output matches `MM:SS` pattern with zero-padded values
    - **Validates: Requirements 11.5**

  - [x] 10.3 Integrate PomodoroTimer into ControlPanel
    - Add pomodoro section with start/stop button and duration config dropdowns
    - Wire pet speech bubble triggers via callback props
    - _Requirements: 11.1, 11.5, 11.6_

- [x] 11. Implement Desktop Widgets
  - [x] 11.1 Create `src/components/WidgetPanel.tsx`
    - Clock widget: display HH:MM, update every 60 seconds
    - Session timer widget: track elapsed time since mount via `useRef(Date.now())` + 1s interval, display HH:MM:SS
    - Weather widget: fetch from Open-Meteo API using `navigator.geolocation`, cache 30 minutes, fallback "Weather unavailable ☁" on error
    - Render as collapsible `<details>` element with `glass` CSS class
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [x] 11.2 Integrate WidgetPanel into the index route layout
    - Add WidgetPanel below StatsPanel in the left column
    - _Requirements: 12.5_

- [x] 12. Checkpoint — Phase 3 complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Implement I18n system
  - [x] 13.1 Create `src/lib/i18n.tsx` with I18nProvider and translation maps
    - Define `translations` object with "en" and "pt" locale maps using dot-notation keys
    - Implement React context with `t(key)` function (returns key itself as fallback for missing keys)
    - Read initial locale from `useGameState().locale`, fallback to `navigator.language`
    - Wrap app at route level
    - _Requirements: 13.1, 13.4, 13.5, 13.6_

  - [x] 13.2 Create English and Portuguese translation entries
    - Translate all UI labels in ControlPanel, StatsPanel, WidgetPanel, Buy_Page
    - Translate pet speech bubbles and thought lines
    - Translate achievement names and accessory names
    - _Requirements: 13.2, 13.3_

  - [ ]* 13.3 Write property test: Translation completeness across locales (Property 13)
    - **Property 13: Translation completeness across locales**
    - Iterate all keys in both locale maps, verify every key in "en" exists in "pt" with non-empty value and vice versa
    - **Validates: Requirements 13.2, 13.3**

  - [x] 13.4 Add language selector to ControlPanel
    - Dropdown or toggle for EN/PT
    - Wire to `useGameState.setLocale()` and I18nProvider
    - _Requirements: 13.4_

  - [x] 13.5 Replace all hardcoded strings with `t()` calls across components
    - ControlPanel, StatsPanel, WidgetPanel, PomodoroTimer, AchievementToast, Pet speech bubbles, Buy page
    - _Requirements: 13.2, 13.3_

- [x] 14. Implement Responsive Mobile Layout
  - [x] 14.1 Update layout for mobile viewports
    - Ensure single-column layout on viewports < 768px (already partially handled by existing grid)
    - Hide hero section on mobile, show compact header
    - Ensure all touch targets are ≥ 44×44px
    - Make ControlPanel sections scrollable on mobile
    - _Requirements: 14.1, 14.4, 14.5_

  - [x] 14.2 Implement touch interactions in Pet.tsx
    - Add `onTouchStart`, `onTouchMove`, `onTouchEnd` handlers
    - Tap → same as click (speech bubble, jump, happiness)
    - Long-press (500ms) → enter drag state
    - Touch drag → follow `touch.clientX/Y`, call `e.preventDefault()` to suppress scroll
    - Double-tap → remove pet (context menu equivalent)
    - Cancel long-press if touch moves > 10px before timer fires
    - _Requirements: 14.2, 14.3, 16.1, 16.2, 16.3, 16.4, 16.5_

  - [x] 14.3 Update Buy page for mobile
    - Show "Desktop app available on Windows, Mac, and Linux only" banner on mobile viewports
    - Replace download form with prominent web demo link on mobile
    - Ensure no horizontal overflow
    - _Requirements: 15.1, 15.2, 15.3_

- [x] 15. Checkpoint — Phase 4 complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Final integration and test setup
  - [ ] 16.1 Install fast-check and configure Vitest test environment
    - Add `fast-check` as dev dependency
    - Create `src/__tests__/` directory structure with one test file per phase
    - Configure Vitest if not already set up (vitest.config.ts)
    - _Requirements: all_

  - [ ]* 16.2 Write unit tests for XP awards, level-up detection, and accessory rendering
    - Verify exact XP amounts for feed (5), play (8), click (2)
    - Verify level-up at thresholds (100, 400, 900, 1600 XP)
    - Verify accessory SVG overlay presence per type
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.2_

  - [ ]* 16.3 Write unit tests for mini-game logic, achievements, and pomodoro
    - Verify catch game spawn rate and scoring
    - Verify memory game card matching logic
    - Verify each achievement triggers on first occurrence only
    - Verify pomodoro work→break→idle state machine transitions
    - _Requirements: 7.2, 7.3, 8.3, 8.4, 9.1, 11.1, 11.2, 11.3_

- [ ] 17. Final checkpoint — All phases complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each phase (tasks 1-4, 5-8, 9-12, 13-15) is independently deployable
- Property tests use fast-check with minimum 100 iterations each
- All state flows through `useGameState` hook backed by localStorage
- SVG-only rendering for accessories and particles — no canvas or external images
- Electron IPC extensions are needed for cross-window communication of new events
