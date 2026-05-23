import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Hand } from '../../../core/models/hand.model';
import { TileValueService } from '../../../core/services/tile-value.service';
import { TileComponent, TileSize } from '../tile/tile.component';

@Component({
  selector: 'app-hand',
  standalone: true,
  imports: [TileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hand.component.html',
  styleUrl: './hand.component.scss',
  host: {
    '[class.hand--lg]': 'size() === "lg"',
    '[class.hand--md]': 'size() === "md"',
    '[class.hand--sm]': 'size() === "sm"',
  },
})
export class HandComponent {
  private readonly tileValue = inject(TileValueService);

  readonly hand = input.required<Hand>();
  readonly size = input<TileSize>('lg');
  readonly tileValues = input<Readonly<Record<string, number>>>({});
  readonly showTotal = input<boolean>(true);

  valueFor(tileId: string, fallback: number): number {
    return this.tileValues()[tileId] ?? fallback;
  }

  valueForTile(t: { id: string; kind: string; baseValue: number }): number {
    if (t.kind === 'number') return t.baseValue;
    return this.tileValues()[t.id] ?? this.tileValue.valueOf(t as never, this.tileValues());
  }
}
