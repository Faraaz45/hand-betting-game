import { TestBed } from '@angular/core/testing';
import { Tile } from '../models/tile.model';
import { TileValueService } from './tile-value.service';

const numberTile = (value: number): Tile => ({
  id: `dots-${value}`,
  suit: 'dots',
  kind: 'number',
  face: String(value),
  glyph: '🀙',
  baseValue: value,
});

const dragon = (which: 'red' | 'green' | 'white'): Tile => ({
  id: `dragon-${which}`,
  suit: 'dragon',
  kind: 'non-number',
  face: `${which} Dragon`,
  glyph: '🀄',
  baseValue: 0,
});

describe('TileValueService', () => {
  let service: TileValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileValueService);
  });

  describe('valueOf', () => {
    it('returns the face value for number tiles', () => {
      expect(service.valueOf(numberTile(7), {})).toBe(7);
    });

    it('returns base value (5) for unseen non-number tiles', () => {
      expect(service.valueOf(dragon('red'), {})).toBe(5);
    });

    it('returns the tracked dynamic value for non-number tiles', () => {
      expect(service.valueOf(dragon('red'), { 'dragon-red': 8 })).toBe(8);
    });
  });

  describe('sum', () => {
    it('sums mixed tile values', () => {
      const tiles = [numberTile(3), dragon('red'), numberTile(4)];
      expect(service.sum(tiles, {})).toBe(3 + 5 + 4);
    });

    it('uses dynamic values for non-number tiles', () => {
      const tiles = [numberTile(3), dragon('red')];
      expect(service.sum(tiles, { 'dragon-red': 9 })).toBe(3 + 9);
    });
  });

  describe('applyDelta', () => {
    it('shifts only non-number tiles', () => {
      const tiles = [numberTile(3), dragon('red')];
      const next = service.applyDelta(tiles, +1, {});
      expect(next['dragon-red']).toBe(6);
      expect(next['dots-3']).toBeUndefined();
    });

    it('decrements on a losing hand', () => {
      const tiles = [dragon('green')];
      const next = service.applyDelta(tiles, -1, { 'dragon-green': 5 });
      expect(next['dragon-green']).toBe(4);
    });

    it('shifts each unique non-number tile id only once per hand', () => {
      const tiles = [dragon('red'), dragon('red')];
      const next = service.applyDelta(tiles, +1, {});
      expect(next['dragon-red']).toBe(6);
    });

    it('does not mutate the input map', () => {
      const input = { 'dragon-red': 5 };
      service.applyDelta([dragon('red')], +1, input);
      expect(input['dragon-red']).toBe(5);
    });
  });

  describe('outOfBounds', () => {
    it('identifies tiles at the minimum (0)', () => {
      const { atMin, atMax } = service.outOfBounds({ 'dragon-red': 0, 'wind-east': 5 });
      expect(atMin).toEqual(['dragon-red']);
      expect(atMax).toEqual([]);
    });

    it('identifies tiles at the maximum (10)', () => {
      const { atMin, atMax } = service.outOfBounds({ 'dragon-red': 10 });
      expect(atMax).toEqual(['dragon-red']);
      expect(atMin).toEqual([]);
    });
  });
});
