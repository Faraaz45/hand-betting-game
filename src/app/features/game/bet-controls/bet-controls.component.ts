import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Bet } from '../../../core/models/game-state.model';

@Component({
  selector: 'app-bet-controls',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bet-controls.component.html',
  styleUrl: './bet-controls.component.scss',
})
export class BetControlsComponent {
  readonly disabled = input<boolean>(false);
  readonly bet = output<Bet>();

  emit(bet: Bet): void {
    if (this.disabled()) return;
    this.bet.emit(bet);
  }
}
