import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exit-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Quit the game?</h2>
    <mat-dialog-content>
      Your current progress and score will not be saved.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close(false)">Stay</button>
      <button mat-flat-button color="warn" (click)="ref.close(true)">Quit</button>
    </mat-dialog-actions>
  `,
})
export class ExitDialogComponent {
  constructor(public ref: MatDialogRef<ExitDialogComponent, boolean>) {}
}
