export type TileSuit = 'dots' | 'bamboo' | 'characters' | 'dragon' | 'wind';
export type TileKind = 'number' | 'non-number';

export interface Tile {
  readonly id: string;
  readonly suit: TileSuit;
  readonly kind: TileKind;
  readonly face: string;
  readonly glyph: string;
  readonly baseValue: number;
}

export const isNonNumber = (tile: Tile): boolean => tile.kind === 'non-number';
