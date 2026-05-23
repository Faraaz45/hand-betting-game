import { Hand } from '../models/hand.model';
import { TotalCompareBetStrategy } from './bet-strategy';

const hand = (total: number): Hand => ({ tiles: [], total });

describe('TotalCompareBetStrategy', () => {
  const strategy = new TotalCompareBetStrategy();

  it('wins on higher when next total is greater', () => {
    expect(strategy.resolve(hand(10), hand(15), 'higher')).toBe('win');
  });

  it('loses on higher when next total is lower', () => {
    expect(strategy.resolve(hand(10), hand(5), 'higher')).toBe('lose');
  });

  it('wins on lower when next total is smaller', () => {
    expect(strategy.resolve(hand(10), hand(5), 'lower')).toBe('win');
  });

  it('loses on lower when next total is greater', () => {
    expect(strategy.resolve(hand(10), hand(15), 'lower')).toBe('lose');
  });

  it('returns push when totals are equal regardless of bet', () => {
    expect(strategy.resolve(hand(10), hand(10), 'higher')).toBe('push');
    expect(strategy.resolve(hand(10), hand(10), 'lower')).toBe('push');
  });
});
