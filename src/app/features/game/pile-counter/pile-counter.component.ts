import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pile-counter',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pile-counter.component.html',
  styleUrl: './pile-counter.component.scss',
})
export class PileCounterComponent {
  readonly drawCount = input.required<number>();
  readonly discardCount = input.required<number>();
  readonly reshuffleCount = input.required<number>();
  readonly maxReshuffles = input.required<number>();
}
