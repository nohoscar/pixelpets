# Requirements Document

## Introduction

PixelPets is a desktop pet application (React + TanStack Start + Electron) featuring 52 pixel art SVG pets with Tamagotchi-style stats, system awareness, and synthesized audio. This feature set adds gameplay engagement (mini-games, leveling, achievements, multi-pet interactions), visual enhancements (equippable accessories, particle effects, night mode), utility features (pomodoro notifications, desktop widgets, i18n), and mobile responsiveness to the web demo. The scope is organized into four phases to deliver maximum value incrementally.

## Glossary

- **Pet_Component**: The main `Pet.tsx` React component that renders a single pet with stats, states, movement, and awareness logic
- **Sprite_System**: The SVG-based rendering system in `petSprites.tsx` that draws each pet kind with animation frames
- **Stats_Engine**: The subsystem within Pet_Component that manages hunger, happiness, and energy values with decay over time
- **XP_System**: A new experience point tracker that accumulates points from mini-games and interactions, driving the Level_System
- **Level_System**: A progression system where pets gain levels based on accumulated XP, unlocking Accessories at defined thresholds
- **Accessory_Renderer**: A new SVG overlay layer that composites equippable items (hats, glasses, bows, scarves, capes) on top of the Sprite_System output
- **Mini_Game_Engine**: A subsystem that presents simple interactive games (object catching, memory matching) within the pet area and awards XP on completion
- **Achievement_Tracker**: A persistent record of milestone completions (e.g., feeding count, survival events) with notification display
- **Particle_System**: A lightweight canvas or SVG-based effect renderer that emits short-lived visual particles during pet actions
- **Night_Mode_Controller**: Logic that reads the current hour from System_Awareness and triggers pajama accessory equipping during nighttime hours
- **Pomodoro_Timer**: A configurable work/break timer that triggers pet-delivered reminder notifications
- **Widget_Panel**: A desktop overlay area displaying clock, weather, and session timer widgets
- **I18n_Provider**: An internationalization wrapper providing translated strings for English and Portuguese locales
- **System_Awareness**: The existing `useSystemAwareness` hook providing battery, idle, time-of-day, and visibility data
- **Control_Panel**: The existing `ControlPanel.tsx` UI for selecting pets, cursors, and toggling follow mode
- **Electron_Main**: The Electron main process (`main.cjs`) managing pet overlay and panel windows
- **Web_Demo**: The TanStack Start web application served at the index route
- **Buy_Page**: The purchase/download page at `/buy`

## Requirements

### Phase 1: Gameplay Core — XP, Levels, and Accessories

### Requirement 1: XP Accumulation

**User Story:** As a player, I want my pet to earn experience points from interactions and mini-games, so that I feel a sense of progression.

#### Acceptance Criteria

1. WHEN the player feeds the pet, THE XP_System SHALL award 5 XP to the active pet
2. WHEN the player plays with the pet, THE XP_System SHALL award 8 XP to the active pet
3. WHEN the player clicks the pet, THE XP_System SHALL award 2 XP to the active pet
4. WHEN the pet completes a mini-game, THE XP_System SHALL award XP proportional to the game score (minimum 10 XP, maximum 50 XP)
5. THE XP_System SHALL persist the accumulated XP value in localStorage so that progress survives page reloads
6. THE Stats_Engine SHALL expose a new `xp` field alongside hunger, happiness, and energy in the PetStats type

### Requirement 2: Level Progression

**User Story:** As a player, I want my pet to level up as it gains XP, so that I can see tangible growth over time.

#### Acceptance Criteria

1. THE Level_System SHALL calculate the pet level using the formula: level = floor(sqrt(xp / 100)) + 1, starting at level 1
2. WHEN the pet accumulates enough XP to reach a new level, THE Level_System SHALL trigger a level-up animation (jump state) and play the "happy" sound
3. WHEN the pet reaches a new level, THE Pet_Component SHALL display a speech bubble showing "Level N!" for 2500 milliseconds
4. THE Level_System SHALL persist the current level in localStorage alongside XP
5. THE Stats_Panel SHALL display the current level and a progress bar showing XP toward the next level

### Requirement 3: Equippable Accessories

**User Story:** As a player, I want to equip my pet with accessories like hats and glasses, so that I can customize its appearance.

#### Acceptance Criteria

1. THE Accessory_Renderer SHALL support five accessory slots: head (hats), eyes (glasses), neck (scarves, bows), back (capes), and special (pajamas)
2. THE Accessory_Renderer SHALL render each equipped accessory as an SVG overlay positioned relative to the pet sprite's bounding box
3. WHEN the player selects an accessory from the Control_Panel, THE Accessory_Renderer SHALL equip the accessory on the active pet within the same animation frame
4. WHEN the pet faces left, THE Accessory_Renderer SHALL mirror the accessory SVG horizontally to match the pet sprite orientation
5. THE Accessory_Renderer SHALL support equipping one accessory per slot simultaneously
6. WHEN the pet is in the "faint" state, THE Accessory_Renderer SHALL apply the same rotation and opacity transforms as the pet sprite
7. THE Level_System SHALL unlock specific accessories at defined level thresholds (level 2: basic hat; level 3: glasses; level 5: bow; level 7: scarf; level 10: cape)
8. THE Control_Panel SHALL display locked accessories as grayed-out with the required level shown

### Requirement 4: Accessory Persistence

**User Story:** As a player, I want my equipped accessories to be remembered between sessions, so that I do not have to re-equip them every time.

#### Acceptance Criteria

1. WHEN the player equips or unequips an accessory, THE Accessory_Renderer SHALL save the current accessory configuration to localStorage
2. WHEN the Pet_Component initializes, THE Accessory_Renderer SHALL load the saved accessory configuration from localStorage and apply the accessories
3. IF localStorage contains an accessory that the pet has not yet unlocked (due to level reset), THEN THE Accessory_Renderer SHALL ignore the locked accessory and display the pet without the item

### Requirement 5: Particle Effects

**User Story:** As a player, I want to see sparkle and particle effects when my pet performs actions, so that interactions feel more alive and rewarding.

#### Acceptance Criteria

1. WHEN the pet enters the "jump" state, THE Particle_System SHALL emit 6 to 10 star-shaped particles radiating outward from the pet center over 400 milliseconds
2. WHEN the player feeds the pet, THE Particle_System SHALL emit 4 to 6 food-themed particles (small circles) floating upward from the pet mouth area over 500 milliseconds
3. WHEN the pet levels up, THE Particle_System SHALL emit 12 to 16 confetti particles in multiple colors radiating outward over 800 milliseconds
4. THE Particle_System SHALL render particles using absolutely-positioned SVG elements within the pet container to avoid layout reflows
5. THE Particle_System SHALL remove all particle DOM elements after their animation completes

### Requirement 6: Automatic Night Mode

**User Story:** As a player, I want my pet to automatically put on pajamas at night, so that the pet feels aware of the real-world time.

#### Acceptance Criteria

1. WHILE System_Awareness reports timeOfDay as "night" (22:00–04:59), THE Night_Mode_Controller SHALL equip the pajama accessory in the special slot
2. WHEN System_Awareness transitions from "night" to "morning", THE Night_Mode_Controller SHALL unequip the pajama accessory from the special slot
3. THE Night_Mode_Controller SHALL not override a manually equipped special-slot accessory; IF the player has manually equipped a special-slot item, THEN THE Night_Mode_Controller SHALL skip automatic pajama equipping
4. WHEN the pajama accessory is auto-equipped, THE Pet_Component SHALL display a speech bubble showing "zzz... pijama time" for 2000 milliseconds

---

### Phase 2: Mini-Games and Achievements

### Requirement 7: Catch Game

**User Story:** As a player, I want to play a catch game with my pet, so that I can earn XP through an engaging activity.

#### Acceptance Criteria

1. WHEN the player activates the catch game from the Control_Panel, THE Mini_Game_Engine SHALL display falling objects (food items represented as emoji) within the pet viewport area
2. THE Mini_Game_Engine SHALL spawn one falling object every 1200 milliseconds for a 30-second game duration
3. WHEN the player clicks a falling object, THE Mini_Game_Engine SHALL remove the object, increment the score by 1, and play the "coin" sound
4. WHEN the 30-second timer expires, THE Mini_Game_Engine SHALL display the final score and award XP equal to score multiplied by 3 (capped at 50 XP)
5. IF the player clicks outside a falling object during the game, THEN THE Mini_Game_Engine SHALL not penalize the score
6. WHILE a mini-game is active, THE Pet_Component SHALL pause normal movement and enter the "idle" state

### Requirement 8: Memory Game

**User Story:** As a player, I want to play a memory matching game with my pet, so that I have variety in gameplay activities.

#### Acceptance Criteria

1. WHEN the player activates the memory game from the Control_Panel, THE Mini_Game_Engine SHALL display a 4x3 grid of face-down cards using pet emoji as pairs
2. WHEN the player clicks a face-down card, THE Mini_Game_Engine SHALL reveal the card's emoji
3. WHEN two cards are revealed, THE Mini_Game_Engine SHALL compare the emoji: IF the emoji match, THEN THE Mini_Game_Engine SHALL keep both cards face-up and play the "happy" sound; IF the emoji do not match, THEN THE Mini_Game_Engine SHALL flip both cards face-down after 800 milliseconds
4. WHEN all pairs are matched, THE Mini_Game_Engine SHALL award XP based on the number of attempts: fewer than 10 attempts awards 50 XP, 10 to 15 attempts awards 30 XP, more than 15 attempts awards 15 XP
5. THE Mini_Game_Engine SHALL track the number of card-flip attempts for XP calculation

### Requirement 9: Achievement System

**User Story:** As a player, I want to unlock achievements for reaching milestones, so that I have long-term goals to work toward.

#### Acceptance Criteria

1. THE Achievement_Tracker SHALL track the following milestones: "Fed 10 times", "Fed 100 times", "Played 50 times", "Reached Level 5", "Reached Level 10", "Survived critical battery", "Played all mini-games", "Equipped first accessory", "Night owl (active at 3 AM)", "Pet clicked 500 times"
2. WHEN a milestone condition is met for the first time, THE Achievement_Tracker SHALL display a toast notification showing the achievement name and icon for 3000 milliseconds
3. WHEN a milestone is unlocked, THE Achievement_Tracker SHALL play the "coin" sound
4. THE Achievement_Tracker SHALL persist all unlocked achievements in localStorage
5. THE Control_Panel SHALL include an achievements section displaying all achievements with locked achievements shown as grayed-out silhouettes
6. THE Achievement_Tracker SHALL expose the total count of unlocked achievements

---

### Phase 3: Multi-Pet, Pomodoro, and Widgets

### Requirement 10: Multiple Simultaneous Pets

**User Story:** As a player, I want to have multiple pets on my desktop at once, so that they can interact with each other.

#### Acceptance Criteria

1. THE Web_Demo SHALL support up to 5 simultaneous Pet_Component instances on screen
2. WHEN two pets are within 80 pixels of each other, THE Pet_Component SHALL trigger an interaction: both pets display a speech bubble (e.g., "hi!", "♥", "play?") and gain 3 happiness points
3. THE Pet_Component SHALL enforce a 10-second cooldown between interactions with the same pet to prevent happiness spam
4. WHEN the player adds a pet via the Control_Panel, THE Pet_Component SHALL spawn at a random position that does not overlap with existing pets
5. THE Stats_Panel SHALL display stats for the most recently clicked pet
6. THE Electron_Main SHALL support rendering multiple pets in the overlay window

### Requirement 11: Pomodoro Timer Notifications

**User Story:** As a player, I want my pet to remind me to take breaks using a pomodoro timer, so that I maintain healthy work habits.

#### Acceptance Criteria

1. WHEN the player starts the Pomodoro_Timer from the Control_Panel, THE Pomodoro_Timer SHALL begin a 25-minute work countdown
2. WHEN the work countdown reaches zero, THE Pomodoro_Timer SHALL trigger the pet to display a speech bubble saying "Break time! 🍅" and play the "happy" sound
3. WHEN the work countdown reaches zero, THE Pomodoro_Timer SHALL begin a 5-minute break countdown
4. WHEN the break countdown reaches zero, THE Pomodoro_Timer SHALL trigger the pet to display a speech bubble saying "Back to work! 💪" and play the "click" sound
5. THE Control_Panel SHALL display the current timer state (work/break) and remaining time in MM:SS format
6. THE Pomodoro_Timer SHALL allow the player to configure work duration (15, 25, or 45 minutes) and break duration (5, 10, or 15 minutes)
7. IF the player stops the Pomodoro_Timer, THEN THE Pomodoro_Timer SHALL reset the countdown and clear the timer display

### Requirement 12: Desktop Widgets

**User Story:** As a player, I want small widgets on my desktop showing clock, weather, and session time, so that my pet area is also functional.

#### Acceptance Criteria

1. THE Widget_Panel SHALL display a digital clock widget showing the current time in HH:MM format, updating every minute
2. THE Widget_Panel SHALL display a session timer widget showing elapsed time since the page loaded in HH:MM:SS format
3. THE Widget_Panel SHALL display a weather widget showing the current temperature and condition icon, fetched from a free weather API using the browser's geolocation
4. IF geolocation is denied or the weather API fails, THEN THE Widget_Panel SHALL display "Weather unavailable" with a cloud icon
5. THE Widget_Panel SHALL render as a collapsible section in the Control_Panel area
6. THE Widget_Panel SHALL use the same glass styling as existing UI components for visual consistency

---

### Phase 4: Internationalization and Mobile Responsiveness

### Requirement 13: Multi-Language Support

**User Story:** As a player, I want to use PixelPets in my preferred language, so that the interface is accessible to me.

#### Acceptance Criteria

1. THE I18n_Provider SHALL support English ("en") and Portuguese ("pt") locales
2. THE I18n_Provider SHALL translate all UI labels in Control_Panel, Stats_Panel, Widget_Panel, and Buy_Page
3. THE I18n_Provider SHALL translate pet speech bubbles and thought lines for both locales
4. WHEN the player selects a language from the Control_Panel, THE I18n_Provider SHALL switch all visible text to the selected locale within the same render cycle
5. THE I18n_Provider SHALL persist the selected locale in localStorage
6. THE I18n_Provider SHALL default to the browser's preferred language if it matches a supported locale, otherwise default to English

### Requirement 14: Responsive Web Demo

**User Story:** As a mobile user, I want the web demo to work on my phone, so that I can interact with pets using touch.

#### Acceptance Criteria

1. THE Web_Demo SHALL render a single-column layout on viewports narrower than 768 pixels
2. THE Web_Demo SHALL support touch-based pet dragging using touchstart, touchmove, and touchend events
3. WHEN the player taps a pet on a touch device, THE Pet_Component SHALL trigger the same click interaction as a mouse click (speech bubble, jump, happiness boost)
4. THE Control_Panel SHALL be fully usable on mobile viewports with scrollable sections and appropriately sized touch targets (minimum 44x44 pixels)
5. THE Web_Demo SHALL hide the desktop-only hero section on mobile viewports and show a compact header instead

### Requirement 15: Mobile-Aware Buy Page

**User Story:** As a mobile visitor, I want to understand that the desktop app is Windows-only while still being able to try the demo, so that my expectations are set correctly.

#### Acceptance Criteria

1. WHEN the Buy_Page detects a mobile viewport (width less than 768 pixels), THE Buy_Page SHALL display a banner stating "Desktop app available on Windows, Mac, and Linux only"
2. THE Buy_Page SHALL replace the download form with a prominent link to the web demo on mobile viewports
3. THE Buy_Page SHALL remain fully readable and scrollable on mobile viewports with no horizontal overflow

### Requirement 16: Touch-Optimized Pet Interactions

**User Story:** As a mobile user, I want the pet playground to be fully functional with touch, so that I get the same experience as desktop users.

#### Acceptance Criteria

1. WHEN the player performs a long-press (500 milliseconds) on a pet on a touch device, THE Pet_Component SHALL enter the drag state, matching the desktop mousedown behavior
2. WHILE the pet is in the drag state on a touch device, THE Pet_Component SHALL follow the touch position using touchmove coordinates
3. WHEN the player lifts the touch during drag, THE Pet_Component SHALL exit the drag state and resume walking, matching the desktop mouseup behavior
4. THE Pet_Component SHALL prevent default browser scroll behavior while dragging a pet on touch devices
5. WHEN the player double-taps a pet on a touch device, THE Pet_Component SHALL trigger the context menu action (remove pet), matching the desktop right-click behavior
