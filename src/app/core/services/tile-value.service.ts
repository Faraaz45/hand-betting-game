import { Injectable, inject } from '@angular/core';
import { Tile } from '../models/tile.model';
import { BASE_NON_NUMBER_VALUE, MAX_TILE_VALUE, MIN_TILE_VALUE } from '../tokens/game-rules.tokens';

@Injectable({ providedIn: 'root' })
export class TileValueService {
  private readonly baseNonNumber = inject(BASE_NON_NUMBER_VALUE);
  private readonly minValue = inject(MIN_TILE_VALUE);
  private readonly maxValue = inject(MAX_TILE_VALUE);

  /** Returns the current value of a tile given a dynamic-value map. */
  valueOf(tile: Tile, tileValues: Readonly<Record<string, number>>): number {
    if (tile.kind === 'number') {
      return tile.baseValue;
    }
    return tileValues[tile.id] ?? this.baseNonNumber;
  }

  /** Sums a list of tiles using current dynamic values. */
  sum(tiles: ReadonlyArray<Tile>, tileValues: Readonly<Record<string, number>>): number {
    return tiles.reduce((acc, tile) => acc + this.valueOf(tile, tileValues), 0);
  }

  /**
   * Apply a delta to every non-number tile in `tiles`. Each unique id is
   * adjusted once even if it appears multiple times in the hand — the spec says
   * "specific to that tile" (i.e., per tile face).
   */
  applyDelta(
    tiles: ReadonlyArray<Tile>,
    delta: number,
    tileValues: Readonly<Record<string, number>>,
  ): Record<string, number> {
    const next: Record<string, number> = { ...tileValues };
    const seen = new Set<string>();
    for (const tile of tiles) {
      if (tile.kind !== 'non-number' || seen.has(tile.id)) {
        continue;
      }
      seen.add(tile.id);
      const current = next[tile.id] ?? this.baseNonNumber;
      next[tile.id] = current + delta;
    }
    return next;
  }

  /**
   * Returns the ids of non-number tiles whose values are at or beyond the
   * configured bounds. Used by the engine to detect the game-over edge.
   */
  outOfBounds(tileValues: Readonly<Record<string, number>>): {
    atMin: string[];
    atMax: string[];
  } {
    const atMin: string[] = [];
    const atMax: string[] = [];
    for (const [id, value] of Object.entries(tileValues)) {
      if (value <= this.minValue) atMin.push(id);
      if (value >= this.maxValue) atMax.push(id);
    }
    return { atMin, atMax };
  }
}
