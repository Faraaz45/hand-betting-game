# Hand Betting Game

A web-based "Hand Betting Game" built with Angular 21 and Angular Material. Players bet whether the next hand of Mahjong tiles will total higher or lower than the current hand. Non-number tiles (Dragons, Winds) scale dynamically with wins and losses, and the game ends when a tile value reaches 0 or 10, or when the draw pile is exhausted for the third time.

> Built as a technical assessment. The codebase prioritises **extensibility** — game rules, deck composition, and bet logic are all swappable via dependency injection so new features can plug in without touching the engine.

---

## Setup

**Requirements:** Node 22+, npm 10+.

```bash
npm install
npm start            # dev server at http://localhost:4200
npm test             # run unit tests (vitest)
npm run build        # production build to dist/hand-betting-game
```

---

## How to Play

1. From the landing page, click **New Game**.
2. You see a hand of 3 Mahjong tiles and its total value.
3. Press **Bet Higher** or **Bet Lower** (or `→` / `←`) to predict whether the next hand's total will be higher or lower.
4. Each correct guess scores 1 point. Each non-number tile in a winning hand gains +1 in value; in a losing hand, it loses 1.
5. The game ends when:
   - Any non-number tile value reaches **0** or **10**, or
   - The draw pile runs out of tiles for the **3rd time**.
6. If your score qualifies for the top 5, enter your name to save it to the leaderboard.

Keyboard: `←` = Bet Lower, `→` = Bet Higher, `Esc` = Exit.

---

## Architecture

```
src/app/
├── core/                              # Singletons, models, pure logic
│   ├── models/                        # Tile, Hand, GameState, ScoreEntry
│   ├── services/
│   │   ├── deck.service.ts            # Deck creation, shuffle, draw, reshuffle
│   │   ├── deck-factory.ts            # DECK_FACTORY token + standard impl
│   │   ├── game-engine.service.ts     # Pure: GameState in → GameState out
│   │   ├── tile-value.service.ts      # Dynamic value tracking + clamping
│   │   ├── game-state.service.ts      # Signal-based state container
│   │   └── leaderboard.service.ts     # localStorage CRUD
│   ├── strategies/
│   │   └── bet-strategy.ts            # BET_STRATEGY token + default impl
│   └── tokens/
│       └── game-rules.tokens.ts       # All configurable rule knobs
├── features/
│   ├── landing/                       # Landing page + leaderboard widget
│   ├── game/                          # Game board, controls, history, exit
│   └── game-over/                     # Score summary + guard
├── shared/
│   └── components/                    # Tile, Hand (visual primitives)
└── app.routes.ts
```

### Design principles

- **Pure engine, dumb components.** `GameEngineService` is a pure function: `(GameState, Bet) → GameState`. Components render and dispatch — they never compute game logic.
- **Signals over RxJS for state.** `GameStateService` exposes a readonly signal; OnPush components read it directly.
- **Rules as injection tokens.** Every numeric rule (hand size, base value, max reshuffles, win/lose deltas, value bounds) is an `InjectionToken` with a default factory.
- **Strategy pattern for bet resolution.** `BetStrategy` is an interface; the default `TotalCompareBetStrategy` does higher/lower vs total. New bet types are new classes, not engine edits.
- **Pluggable deck.** `DeckFactory` is a token; swap the standard Mahjong deck for jokers, themed decks, or custom compositions without changing the engine.

### Configurable rules

| Token                    | Default | What it controls                                       |
|--------------------------|---------|--------------------------------------------------------|
| `HAND_SIZE`              | 3       | Number of tiles in a hand                              |
| `BASE_NON_NUMBER_VALUE`  | 5       | Starting value for Dragons / Winds                     |
| `MAX_RESHUFFLES`         | 3       | Game-over after this many reshuffles                   |
| `WIN_DELTA`              | +1      | Value change on each non-number tile in a winning hand |
| `LOSE_DELTA`             | -1      | Value change on each non-number tile in a losing hand  |
| `MIN_TILE_VALUE`         | 0       | Lower bound triggering game-over                       |
| `MAX_TILE_VALUE`         | 10      | Upper bound triggering game-over                       |
| `LEADERBOARD_SIZE`       | 5       | Number of top scores kept                              |

Override any of them in `app.config.ts`:

```ts
{ provide: HAND_SIZE, useValue: 5 }
```

---

## How to extend

### Example: adding a new bet type ("Bet Exact")

1. Implement a new strategy:

   ```ts
   // src/app/core/strategies/bet-exact.strategy.ts
   export class ExactCompareBetStrategy implements BetStrategy {
     resolve(current: Hand, next: Hand, bet: Bet): BetResult {
       // ...your rules here
     }
   }
   ```

2. Register it in `app.config.ts`:

   ```ts
   { provide: BET_STRATEGY, useClass: ExactCompareBetStrategy }
   ```

The engine, components, and tests don't need to change.

### Other extension points

- **New deck composition** — implement `DeckFactory`, register as `DECK_FACTORY`.
- **Backend leaderboard** — implement the same shape as `LocalStorageLeaderboardStore` (read/write) and inject it into `LeaderboardService`.
- **New game-over condition** — add a check inside `GameEngineService.applyGameOverChecks` and a `GameOverReason` value.
- **Persistent in-progress games** — `GameState` is fully serialisable; add load/save to `GameStateService`.

---

## Testing

Tests run via `npm test` (Vitest, headless). The `core/` layer (engine, deck, tile values, strategy, leaderboard) is covered with unit tests including all three game-over conditions and the reshuffle path.

End-to-end tests (Cypress/Playwright) were deliberately skipped given the 4-day timeline — the engine logic is exercised by an integration-style test in `game-engine.service.spec.ts` that drives a full session through scoring, value scaling, and game-over.

---

## What was handwritten vs. AI-assisted

This project was built collaboratively with Claude (Anthropic's coding assistant). The split:

- **Handwritten / human-led decisions:**
  - Overall architecture (engine + strategy + tokens layering, signal-based state container, lazy-loaded routes).
  - The "feature-ready" extension points and which rules deserved tokens.
  - The interpretation of ambiguous spec items: hand size of 3, totals-vs-totals bet rule, "push" on equal totals, scoring = count of wins.
  - Visual direction: cream/parchment tiles, red glyphs for non-number, gradient title, animation feel.

- **AI-assisted execution:**
  - Code scaffolding for components, services, tests, and SCSS.
  - Boilerplate Angular patterns (signal inputs, OnPush, standalone components, providers).
  - Vitest spec generation against the established interfaces.
  - SCSS keyframes and Material-3 variable wiring.

- **Verification:** all design decisions were validated end-to-end by running the dev server and the test suite (47 passing tests at submission).

---

## Project status

- Tests: **47/47 passing**
- Build: clean (`npm run build`)
- See [docs/plans/2026-05-23-hand-betting-game-design.md](../docs/plans/2026-05-23-hand-betting-game-design.md) for the full phased design document.
