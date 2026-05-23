import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
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
    '[class.tile--pulse-up]': 'pulse() === "up"',
    '[class.tile--pulse-down]': 'pulse() === "down"',
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

  readonly pulse = signal<'up' | 'down' | null>(null);
  private lastValue: number | null = null;
  private pulseTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const v = this.displayValue();
      if (v === null) return;
      if (this.lastValue === null) {
        this.lastValue = v;
        return;
      }
      if (v !== this.lastValue) {
        this.pulse.set(v > this.lastValue ? 'up' : 'down');
        if (this.pulseTimer) clearTimeout(this.pulseTimer);
        this.pulseTimer = setTimeout(() => this.pulse.set(null), 600);
        this.lastValue = v;
      }
    });
  }
}
