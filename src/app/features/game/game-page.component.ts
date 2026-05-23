import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Bet } from '../../core/models/game-state.model';
import { GameStateService } from '../../core/services/game-state.service';
import { MAX_RESHUFFLES } from '../../core/tokens/game-rules.tokens';
import { HandComponent } from '../../shared/components/hand/hand.component';
import { BetControlsComponent } from './bet-controls/bet-controls.component';
import { ExitDialogComponent } from './exit-dialog/exit-dialog.component';
import { HistoryStripComponent } from './history-strip/history-strip.component';
import { PileCounterComponent } from './pile-counter/pile-counter.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    HandComponent,
    BetControlsComponent,
    HistoryStripComponent,
    PileCounterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
})
export class GamePageComponent implements OnInit {
  private readonly gameState = inject(GameStateService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  readonly maxReshuffles = inject(MAX_RESHUFFLES);

  readonly state = this.gameState.snapshot;
  readonly latestResult = computed(() => {
    const s = this.state();
    if (!s || s.history.length === 0) return null;
    return s.history[s.history.length - 1];
  });

  constructor() {
    effect(() => {
      if (this.gameState.isGameOver()) {
        this.router.navigate(['/game-over']);
      }
    });
  }

  ngOnInit(): void {
    if (!this.state()) {
      this.gameState.newGame();
    }
  }

  onBet(bet: Bet): void {
    this.gameState.placeBet(bet);
  }

  async onExit(): Promise<void> {
    const ref = this.dialog.open(ExitDialogComponent, { width: '360px' });
    const confirmed = await ref.afterClosed().toPromise();
    if (confirmed) {
      this.gameState.reset();
      this.router.navigate(['/']);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement) return;
    if (event.key === 'ArrowLeft') this.onBet('lower');
    else if (event.key === 'ArrowRight') this.onBet('higher');
    else if (event.key === 'Escape') this.onExit();
  }
}
