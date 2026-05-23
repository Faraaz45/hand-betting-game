import { Injectable, inject } from '@angular/core';
import { Hand } from '../models/hand.model';
import {
  Bet,
  BetResult,
  GameOverReason,
  GameState,
  HandHistoryEntry,
} from '../models/game-state.model';
import { Tile } from '../models/tile.model';
import { BET_STRATEGY } from '../strategies/bet-strategy';
import { HAND_SIZE, MAX_RESHUFFLES } from '../tokens/game-rules.tokens';
import { DeckService } from './deck.service';
import { TileValueService } from './tile-value.service';

interface DrawResult {
  hand: Hand;
  drawPile: Tile[];
  discardPile: Tile[];
  reshuffleCount: number;
  reshuffledOut: boolean;
}

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private readonly deck = inject(DeckService);
  private readonly tileValue = inject(TileValueService);
  private readonly strategy = inject(BET_STRATEGY);
  private readonly handSize = inject(HAND_SIZE);
  private readonly maxReshuffles = inject(MAX_RESHUFFLES);

  startGame(): GameState {
    const drawPile = this.deck.shuffle(this.deck.createDeck());
    const tileValues: Record<string, number> = {};
    const drawn = this.drawHand(drawPile, [], 0, tileValues);
    return {
      drawPile: drawn.drawPile,
      discardPile: drawn.discardPile,
      currentHand: drawn.hand,
      history: [],
      score: 0,
      reshuffleCount: drawn.reshuffleCount,
      tileValues,
      status: 'in-progress',
    };
  }

  placeBet(state: GameState, bet: Bet): GameState {
    if (state.status === 'game-over') return state;

    const drawn = this.drawHand(
      state.drawPile,
      [...state.discardPile, ...state.currentHand.tiles],
      state.reshuffleCount,
      state.tileValues,
    );

    const result: BetResult = this.strategy.resolve(state.currentHand, drawn.hand, bet);

    let tileValues = state.tileValues;
    if (result === 'win') {
      tileValues = this.tileValue.applyDelta(drawn.hand.tiles, +1, tileValues);
    } else if (result === 'lose') {
      tileValues = this.tileValue.applyDelta(drawn.hand.tiles, -1, tileValues);
    }

    const historyEntry: HandHistoryEntry = {
      hand: state.currentHand,
      bet,
      result,
      timestamp: Date.now(),
    };

    const refreshedHand: Hand = {
      tiles: drawn.hand.tiles,
      total: this.tileValue.sum(drawn.hand.tiles, tileValues),
    };

    const score = state.score + (result === 'win' ? 1 : 0);

    const partial: GameState = {
      drawPile: drawn.drawPile,
      discardPile: drawn.discardPile,
      currentHand: refreshedHand,
      history: [...state.history, historyEntry],
      score,
      reshuffleCount: drawn.reshuffleCount,
      tileValues,
      status: 'in-progress',
    };

    return this.applyGameOverChecks(partial);
  }

  private drawHand(
    drawPile: ReadonlyArray<Tile>,
    discardPile: ReadonlyArray<Tile>,
    reshuffleCount: number,
    tileValues: Readonly<Record<string, number>>,
  ): DrawResult {
    let pile: Tile[] = [...drawPile];
    let discard: Tile[] = [...discardPile];
    let reshuffles = reshuffleCount;
    let reshuffledOut = false;

    if (pile.length < this.handSize) {
      pile = [...this.deck.reshuffle(discard), ...pile];
      discard = [];
      reshuffles += 1;
      if (reshuffles > this.maxReshuffles) {
        reshuffledOut = true;
      }
    }

    const tiles = pile.splice(0, this.handSize);
    const hand: Hand = {
      tiles,
      total: this.tileValue.sum(tiles, tileValues),
    };

    return {
      hand,
      drawPile: pile,
      discardPile: discard,
      reshuffleCount: reshuffles,
      reshuffledOut,
    };
  }

  private applyGameOverChecks(state: GameState): GameState {
    let reason: GameOverReason | undefined;

    if (state.reshuffleCount > this.maxReshuffles) {
      reason = 'reshuffles-exhausted';
    } else {
      const { atMin, atMax } = this.tileValue.outOfBounds(state.tileValues);
      if (atMin.length > 0) reason = 'tile-zero';
      else if (atMax.length > 0) reason = 'tile-max';
    }

    if (!reason) return state;

    return {
      ...state,
      status: 'game-over',
      gameOverReason: reason,
    };
  }
}
