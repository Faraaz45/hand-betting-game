import { Tile } from './tile.model';

export interface Hand {
  readonly tiles: ReadonlyArray<Tile>;
  readonly total: number;
}
