import { InjectionToken } from '@angular/core';
import { Tile, TileSuit } from '../models/tile.model';

export interface DeckFactory {
  createDeck(): Tile[];
}

export const DECK_FACTORY = new InjectionToken<DeckFactory>('DECK_FACTORY', {
  providedIn: 'root',
  factory: () => new StandardMahjongDeckFactory(),
});

const NUMBER_GLYPHS: Readonly<Record<Exclude<TileSuit, 'dragon' | 'wind'>, readonly string[]>> = {
  dots: ['🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡'],
  bamboo: ['🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘'],
  characters: ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏'],
};

const DRAGONS: ReadonlyArray<{ id: string; face: string; glyph: string }> = [
  { id: 'dragon-red', face: 'Red Dragon', glyph: '🀄' },
  { id: 'dragon-green', face: 'Green Dragon', glyph: '🀅' },
  { id: 'dragon-white', face: 'White Dragon', glyph: '🀆' },
];

const WINDS: ReadonlyArray<{ id: string; face: string; glyph: string }> = [
  { id: 'wind-east', face: 'East Wind', glyph: '🀀' },
  { id: 'wind-south', face: 'South Wind', glyph: '🀁' },
  { id: 'wind-west', face: 'West Wind', glyph: '🀂' },
  { id: 'wind-north', face: 'North Wind', glyph: '🀃' },
];

const COPIES_PER_TILE = 4;

export class StandardMahjongDeckFactory implements DeckFactory {
  createDeck(): Tile[] {
    const tiles: Tile[] = [];

    for (const suit of ['dots', 'bamboo', 'characters'] as const) {
      for (let value = 1; value <= 9; value++) {
        const glyph = NUMBER_GLYPHS[suit][value - 1];
        const id = `${suit}-${value}`;
        for (let copy = 0; copy < COPIES_PER_TILE; copy++) {
          tiles.push({
            id,
            suit,
            kind: 'number',
            face: String(value),
            glyph,
            baseValue: value,
          });
        }
      }
    }

    for (const dragon of DRAGONS) {
      for (let copy = 0; copy < COPIES_PER_TILE; copy++) {
        tiles.push({
          id: dragon.id,
          suit: 'dragon',
          kind: 'non-number',
          face: dragon.face,
          glyph: dragon.glyph,
          baseValue: 0,
        });
      }
    }

    for (const wind of WINDS) {
      for (let copy = 0; copy < COPIES_PER_TILE; copy++) {
        tiles.push({
          id: wind.id,
          suit: 'wind',
          kind: 'non-number',
          face: wind.face,
          glyph: wind.glyph,
          baseValue: 0,
        });
      }
    }

    return tiles;
  }
}
