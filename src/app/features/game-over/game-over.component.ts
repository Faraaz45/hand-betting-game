import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let s = state();
    @if (s) {
      <main class="over">
        <h1>Game Over</h1>
        <p class="over__score">Final score: <strong>{{ s.score }}</strong></p>
        <p class="over__reason">{{ reasonLabel(s.gameOverReason) }}</p>
        <div class="over__actions">
          <button mat-flat-button color="primary" (click)="playAgain()">Play Again</button>
          <button mat-button (click)="toLanding()">Back to Landing</button>
        </div>
      </main>
    }
  `,
  styles: `
    .over {
      max-width: 560px;
      margin: 0 auto;
      padding: 80px 16px;
      text-align: center;
    }
    h1 { font-size: 44px; margin: 0 0 12px; }
    .over__score { font-size: 22px; margin: 0 0 4px; }
    .over__reason { color: var(--mat-sys-on-surface-variant); margin: 0 0 24px; }
    .over__actions { display: flex; gap: 12px; justify-content: center; }
  `,
})
export class GameOverComponent {
  private readonly gameState = inject(GameStateService);
  private readonly router = inject(Router);
  readonly state = this.gameState.snapshot;

  reasonLabel(reason: string | undefined): string {
    switch (reason) {
      case 'tile-zero':
        return 'A tile value dropped to 0.';
      case 'tile-max':
        return 'A tile value reached 10.';
      case 'reshuffles-exhausted':
        return 'The draw pile was exhausted 3 times.';
      default:
        return '';
    }
  }

  playAgain(): void {
    this.gameState.newGame();
    this.router.navigate(['/game']);
  }

  toLanding(): void {
    this.gameState.reset();
    this.router.navigate(['/']);
  }
}
