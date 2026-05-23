import { InjectionToken } from '@angular/core';
import { Hand } from '../models/hand.model';
import { Bet, BetResult } from '../models/game-state.model';

export interface BetStrategy {
  resolve(current: Hand, next: Hand, bet: Bet): BetResult;
}

export const BET_STRATEGY = new InjectionToken<BetStrategy>('BET_STRATEGY', {
  providedIn: 'root',
  factory: () => new TotalCompareBetStrategy(),
});

/**
 * Default strategy: compare totals.
 * - Higher: win iff next.total > current.total
 * - Lower:  win iff next.total < current.total
 * - Equal totals are a push (no win/lose, no value change).
 */
export class TotalCompareBetStrategy implements BetStrategy {
  resolve(current: Hand, next: Hand, bet: Bet): BetResult {
    if (next.total === current.total) return 'push';
    const wentHigher = next.total > current.total;
    const won = (bet === 'higher' && wentHigher) || (bet === 'lower' && !wentHigher);
    return won ? 'win' : 'lose';
  }
}
