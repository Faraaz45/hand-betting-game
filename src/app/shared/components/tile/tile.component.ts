import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tile } from '../../../core/models/tile.model';

export type TileSize = 'lg' | 'md' | 'sm';

@Component({
  selector: 'app-tile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
  host: {
    '[class.tile]': 'true',
    '[class.tile--lg]': 'size() === "lg"',
    '[class.tile--md]': 'size() === "md"',
    '[class.tile--sm]': 'size() === "sm"',
    '[class.tile--non-number]': 'tile().kind === "non-number"',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class TileComponent {
  readonly tile = input.required<Tile>();
  readonly size = input<TileSize>('md');
  readonly value = input<number | null>(null);

  readonly displayValue = computed(() => {
    const explicit = this.value();
    if (explicit !== null) return explicit;
    return this.tile().kind === 'number' ? this.tile().baseValue : null;
  });

  readonly ariaLabel = computed(() => {
    const t = this.tile();
    const v = this.displayValue();
    return v !== null ? `${t.face} tile, value ${v}` : `${t.face} tile`;
  });
}
