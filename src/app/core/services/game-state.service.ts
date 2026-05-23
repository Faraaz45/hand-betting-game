import { Injectable, computed, inject, signal } from '@angular/core';
import { GameState, Bet } from '../models/game-state.model';
import { GameEngineService } from './game-engine.service';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private readonly engine = inject(GameEngineService);
  private readonly state = signal<GameState | null>(null);

  readonly snapshot = this.state.asReadonly();
  readonly isActive = computed(() => this.state() !== null && this.state()!.status === 'in-progress');
  readonly isGameOver = computed(() => this.state()?.status === 'game-over');

  newGame(): void {
    this.state.set(this.engine.startGame());
  }

  placeBet(bet: Bet): void {
    const current = this.state();
    if (!current || current.status === 'game-over') return;
    this.state.set(this.engine.placeBet(current, bet));
  }

  reset(): void {
    this.state.set(null);
  }
}
