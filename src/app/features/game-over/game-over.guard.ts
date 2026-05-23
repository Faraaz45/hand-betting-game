import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameStateService } from '../../core/services/game-state.service';

export const gameOverGuard: CanActivateFn = () => {
  const gameState = inject(GameStateService);
  const router = inject(Router);
  if (gameState.isGameOver()) return true;
  return router.parseUrl('/');
};
