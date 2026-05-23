import { Injectable, inject } from '@angular/core';
import { ScoreEntry } from '../models/score-entry.model';
import { LEADERBOARD_SIZE } from '../tokens/game-rules.tokens';

const STORAGE_KEY = 'hbg.leaderboard.v1';

export interface LeaderboardStore {
  read(): ScoreEntry[];
  write(entries: ScoreEntry[]): void;
}

class LocalStorageLeaderboardStore implements LeaderboardStore {
  read(): ScoreEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (e): e is ScoreEntry =>
          !!e &&
          typeof e === 'object' &&
          typeof (e as ScoreEntry).name === 'string' &&
          typeof (e as ScoreEntry).score === 'number' &&
          typeof (e as ScoreEntry).date === 'string',
      );
    } catch {
      return [];
    }
  }

  write(entries: ScoreEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* storage may be unavailable; non-fatal */
    }
  }
}

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly size = inject(LEADERBOARD_SIZE);
  private readonly store: LeaderboardStore = new LocalStorageLeaderboardStore();

  topScores(): ScoreEntry[] {
    return [...this.store.read()].sort((a, b) => b.score - a.score).slice(0, this.size);
  }

  qualifies(score: number): boolean {
    const top = this.topScores();
    if (top.length < this.size) return true;
    return score > top[top.length - 1].score;
  }

  submit(name: string, score: number): ScoreEntry[] {
    const entry: ScoreEntry = {
      name: name.trim().slice(0, 16) || 'Anonymous',
      score,
      date: new Date().toISOString(),
    };
    const all = [...this.store.read(), entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, this.size);
    this.store.write(all);
    return all;
  }
}
