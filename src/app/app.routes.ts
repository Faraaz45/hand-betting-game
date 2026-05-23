import { Routes } from '@angular/router';
import { gameOverGuard } from './features/game-over/game-over.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing-page.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./features/game/game-page.component').then((m) => m.GamePageComponent),
  },
  {
    path: 'game-over',
    canActivate: [gameOverGuard],
    loadComponent: () =>
      import('./features/game-over/game-over.component').then((m) => m.GameOverComponent),
  },
  { path: '**', redirectTo: '' },
];
