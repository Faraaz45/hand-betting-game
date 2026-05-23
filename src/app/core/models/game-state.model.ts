import { Hand } from './hand.model';
import { Tile } from './tile.model';

export type Bet = 'higher' | 'lower';
export type BetResult = 'win' | 'lose' | 'push';

export type GameOverReason = 'tile-zero' | 'tile-max' | 'reshuffles-exhausted';

export interface HandHistoryEntry {
  readonly hand: Hand;
  readonly bet: Bet;
  readonly result: BetResult;
  readonly timestamp: number;
}

export interface GameState {
  readonly drawPile: ReadonlyArray<Tile>;
  readonly discardPile: ReadonlyArray<Tile>;
  readonly currentHand: Hand;
  readonly history: ReadonlyArray<HandHistoryEntry>;
  readonly score: number;
  readonly reshuffleCount: number;
  readonly tileValues: Readonly<Record<string, number>>;
  readonly status: 'in-progress' | 'game-over';
  readonly gameOverReason?: GameOverReason;
}
