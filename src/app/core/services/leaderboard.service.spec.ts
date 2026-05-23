import { TestBed } from '@angular/core/testing';
import { LeaderboardService } from './leaderboard.service';
import { LEADERBOARD_SIZE } from '../tokens/game-rules.tokens';

describe('LeaderboardService', () => {
  let service: LeaderboardService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: LEADERBOARD_SIZE, useValue: 3 }],
    });
    service = TestBed.inject(LeaderboardService);
  });

  it('returns an empty list when storage is empty', () => {
    expect(service.topScores()).toEqual([]);
  });

  it('persists submitted scores across new service instances', () => {
    service.submit('Alice', 5);
    const fresh = TestBed.inject(LeaderboardService);
    expect(fresh.topScores().length).toBe(1);
    expect(fresh.topScores()[0].name).toBe('Alice');
  });

  it('returns scores sorted high-to-low, capped at LEADERBOARD_SIZE', () => {
    service.submit('A', 3);
    service.submit('B', 9);
    service.submit('C', 1);
    service.submit('D', 7);
    const top = service.topScores();
    expect(top.map((s) => s.score)).toEqual([9, 7, 3]);
  });

  it('qualifies when fewer than N entries exist regardless of score', () => {
    expect(service.qualifies(0)).toBe(true);
  });

  it('qualifies only above the lowest top-N score once full', () => {
    service.submit('A', 5);
    service.submit('B', 6);
    service.submit('C', 7);
    expect(service.qualifies(8)).toBe(true);
    expect(service.qualifies(5)).toBe(false);
  });

  it('falls back to "Anonymous" for empty names', () => {
    service.submit('   ', 4);
    expect(service.topScores()[0].name).toBe('Anonymous');
  });

  it('trims long names to 16 chars', () => {
    service.submit('A_very_very_long_name_here', 4);
    expect(service.topScores()[0].name.length).toBe(16);
  });
});
