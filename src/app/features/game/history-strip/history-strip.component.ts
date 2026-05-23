import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HandHistoryEntry } from '../../../core/models/game-state.model';
import { HandComponent } from '../../../shared/components/hand/hand.component';

@Component({
  selector: 'app-history-strip',
  standalone: true,
  imports: [HandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './history-strip.component.html',
  styleUrl: './history-strip.component.scss',
})
export class HistoryStripComponent {
  readonly entries = input.required<ReadonlyArray<HandHistoryEntry>>();
  readonly tileValues = input<Readonly<Record<string, number>>>({});

  /** Newest entry first for the horizontal strip. */
  recent(): HandHistoryEntry[] {
    return [...this.entries()].slice(-10).reverse();
  }
}
