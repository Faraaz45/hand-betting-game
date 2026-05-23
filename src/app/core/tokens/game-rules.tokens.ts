import { InjectionToken } from '@angular/core';

export const HAND_SIZE = new InjectionToken<number>('HAND_SIZE', {
  providedIn: 'root',
  factory: () => 3,
});

export const BASE_NON_NUMBER_VALUE = new InjectionToken<number>('BASE_NON_NUMBER_VALUE', {
  providedIn: 'root',
  factory: () => 5,
});

export const MAX_RESHUFFLES = new InjectionToken<number>('MAX_RESHUFFLES', {
  providedIn: 'root',
  factory: () => 3,
});

export const WIN_DELTA = new InjectionToken<number>('WIN_DELTA', {
  providedIn: 'root',
  factory: () => 1,
});

export const LOSE_DELTA = new InjectionToken<number>('LOSE_DELTA', {
  providedIn: 'root',
  factory: () => -1,
});

export const MIN_TILE_VALUE = new InjectionToken<number>('MIN_TILE_VALUE', {
  providedIn: 'root',
  factory: () => 0,
});

export const MAX_TILE_VALUE = new InjectionToken<number>('MAX_TILE_VALUE', {
  providedIn: 'root',
  factory: () => 10,
});

export const LEADERBOARD_SIZE = new InjectionToken<number>('LEADERBOARD_SIZE', {
  providedIn: 'root',
  factory: () => 5,
});
