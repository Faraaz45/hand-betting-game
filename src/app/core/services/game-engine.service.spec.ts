import { TestBed } from '@angular/core/testing';
import { BetStrategy, BET_STRATEGY } from '../strategies/bet-strategy';
import {
  BASE_NON_NUMBER_VALUE,
  HAND_SIZE,
  MAX_RESHUFFLES,
  MAX_TILE_VALUE,
  MIN_TILE_VALUE,
} from '../tokens/game-rules.tokens';
import { GameEngineService } from './game-engine.service';
import { GameState, Bet, BetResult } from '../models/game-state.model';
import { Hand } from '../models/hand.model';

/** A stub strategy whose verdict can be set per test. */
class StubStrategy implements BetStrategy {
  next: BetResult = 'win';
  resolve(_current: Hand, _next: Hand, _bet: Bet): BetResult {
    return this.next;
  }
}

function configure(stub: StubStrategy, overrides: Array<{ provide: unknown; useValue: unknown }> = []) {
  TestBed.configureTestingModule({
    providers: [
      { provide: BET_STRATEGY, useValue: stub },
      ...(overrides as never[]),
    ],
  });
  return TestBed.inject(GameEngineService);
}

describe('GameEngineService', () => {
  let stub: StubStrategy;

  beforeEach(() => {
    stub = new StubStrategy();
  });

  describe('startGame', () => {
    it('returns an in-progress state with a current hand of HAND_SIZE tiles', () => {
      const engine = configure(stub);
      const state = engine.startGame();
      expect(state.status).toBe('in-progress');
      expect(state.currentHand.tiles.length).toBe(3);
      expect(state.score).toBe(0);
      expect(state.reshuffleCount).toBe(0);
      expect(state.history).toEqual([]);
    });

    it('computes the initial hand total correctly', () => {
      const engine = configure(stub);
      const state = engine.startGame();
      const expected = state.currentHand.tiles.reduce((acc, t) => {
        return acc + (t.kind === 'number' ? t.baseValue : 5);
      }, 0);
      expect(state.currentHand.total).toBe(expected);
    });
  });

  describe('placeBet', () => {
    it('increments score and shifts non-number tiles by +1 on a win', () => {
      stub.next = 'win';
      const engine = configure(stub);
      const start = engine.startGame();
      const after = engine.placeBet(start, 'higher');
      expect(after.score).toBe(1);

      const newNonNumberIds = after.currentHand.tiles
        .filter((t) => t.kind === 'non-number')
        .map((t) => t.id);
      for (const id of newNonNumberIds) {
        expect(after.tileValues[id]).toBe(6);
      }
    });

    it('keeps score and shifts non-number tiles by -1 on a loss', () => {
      stub.next = 'lose';
      const engine = configure(stub);
      const start = engine.startGame();
      const after = engine.placeBet(start, 'lower');
      expect(after.score).toBe(0);

      const newNonNumberIds = after.currentHand.tiles
        .filter((t) => t.kind === 'non-number')
        .map((t) => t.id);
      for (const id of newNonNumberIds) {
        expect(after.tileValues[id]).toBe(4);
      }
    });

    it('does not change score or tile values on a push', () => {
      stub.next = 'push';
      const engine = configure(stub);
      const start = engine.startGame();
      const after = engine.placeBet(start, 'higher');
      expect(after.score).toBe(0);
      expect(after.tileValues).toEqual(start.tileValues);
    });

    it('appends a history entry referencing the previous hand', () => {
      stub.next = 'win';
      const engine = configure(stub);
      const start = engine.startGame();
      const after = engine.placeBet(start, 'higher');
      expect(after.history.length).toBe(1);
      expect(after.history[0].hand).toEqual(start.currentHand);
      expect(after.history[0].bet).toBe('higher');
      expect(after.history[0].result).toBe('win');
    });

    it('moves the previous hand into the discard pile', () => {
      stub.next = 'win';
      const engine = configure(stub);
      const start = engine.startGame();
      const after = engine.placeBet(start, 'higher');
      const discardIds = after.discardPile.map((t) => t.id).sort();
      const expected = start.currentHand.tiles.map((t) => t.id).sort();
      expect(discardIds).toEqual(expected);
    });
  });

  describe('game over conditions', () => {
    it('flags game-over when a non-number tile drops to 0 (MIN)', () => {
      stub.next = 'lose';
      const engine = configure(stub, [
        { provide: BASE_NON_NUMBER_VALUE, useValue: 1 },
        { provide: MIN_TILE_VALUE, useValue: 0 },
        { provide: MAX_TILE_VALUE, useValue: 10 },
      ]);
      const start = engine.startGame();
      // Force at least one non-number tile in the drawn hand by stepping many times if needed.
      let state: GameState = start;
      for (let i = 0; i < 50 && state.status !== 'game-over'; i++) {
        state = engine.placeBet(state, 'lower');
      }
      expect(state.status).toBe('game-over');
      expect(state.gameOverReason).toBe('tile-zero');
    });

    it('flags game-over when a non-number tile reaches 10 (MAX)', () => {
      stub.next = 'win';
      const engine = configure(stub, [
        { provide: BASE_NON_NUMBER_VALUE, useValue: 9 },
        { provide: MIN_TILE_VALUE, useValue: 0 },
        { provide: MAX_TILE_VALUE, useValue: 10 },
      ]);
      let state: GameState = engine.startGame();
      for (let i = 0; i < 50 && state.status !== 'game-over'; i++) {
        state = engine.placeBet(state, 'higher');
      }
      expect(state.status).toBe('game-over');
      expect(state.gameOverReason).toBe('tile-max');
    });

    it('flags game-over after MAX_RESHUFFLES is exceeded', () => {
      stub.next = 'push';
      const engine = configure(stub, [
        { provide: HAND_SIZE, useValue: 3 },
        { provide: MAX_RESHUFFLES, useValue: 1 },
      ]);
      // Each placeBet draws 3 more tiles. 136-3 starting deck, so ~45 bets to exhaust once;
      // and the reshuffle re-injects 136 + discarded. After enough draws, reshuffles exceed 1.
      let state: GameState = engine.startGame();
      for (let i = 0; i < 200 && state.status !== 'game-over'; i++) {
        state = engine.placeBet(state, 'higher');
      }
      expect(state.status).toBe('game-over');
      expect(state.gameOverReason).toBe('reshuffles-exhausted');
    });

    it('returns the same state if placeBet is called after game-over', () => {
      stub.next = 'win';
      const engine = configure(stub);
      const start = engine.startGame();
      const ended: GameState = { ...start, status: 'game-over', gameOverReason: 'tile-zero' };
      expect(engine.placeBet(ended, 'higher')).toBe(ended);
    });
  });
});
