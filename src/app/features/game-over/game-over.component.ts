import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { GameOverReason } from '../../core/models/game-state.model';
import { GameStateService } from '../../core/services/game-state.service';
import { LeaderboardService } from '../../core/services/leaderboard.service';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
})
export class GameOverComponent {
  private readonly gameState = inject(GameStateService);
  private readonly leaderboard = inject(LeaderboardService);
  private readonly router = inject(Router);

  readonly state = this.gameState.snapshot;
  readonly score = computed(() => this.state()?.score ?? 0);
  readonly qualifies = computed(() => this.leaderboard.qualifies(this.score()));

  readonly name = signal('');
  readonly submitted = signal(false);

  reasonLabel(reason: GameOverReason | undefined): string {
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

  submitScore(): void {
    if (this.submitted()) return;
    this.leaderboard.submit(this.name(), this.score());
    this.submitted.set(true);
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
