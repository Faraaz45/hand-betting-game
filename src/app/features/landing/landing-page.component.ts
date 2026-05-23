import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="landing">
      <h1 class="landing__title">Hand Betting Game</h1>
      <p class="landing__subtitle">Bet whether the next hand of Mahjong tiles totals higher or lower.</p>
      <button mat-flat-button color="primary" class="landing__cta" (click)="newGame()">
        <mat-icon>play_arrow</mat-icon>
        New Game
      </button>
    </main>
  `,
  styles: `
    .landing {
      max-width: 720px;
      margin: 0 auto;
      padding: 80px 16px;
      text-align: center;
    }
    .landing__title {
      font-size: 56px;
      font-weight: 800;
      margin: 0 0 12px;
      letter-spacing: -0.02em;
    }
    .landing__subtitle {
      color: var(--mat-sys-on-surface-variant);
      margin: 0 0 32px;
      font-size: 18px;
    }
    .landing__cta {
      height: 56px;
      min-width: 200px;
      font-size: 18px;
    }
  `,
})
export class LandingPageComponent {
  private readonly router = inject(Router);
  private readonly gameState = inject(GameStateService);

  newGame(): void {
    this.gameState.newGame();
    this.router.navigate(['/game']);
  }
}
