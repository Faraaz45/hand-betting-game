import { TestBed } from '@angular/core/testing';
import { Tile } from '../../../core/models/tile.model';
import { TileComponent } from './tile.component';

const numberTile: Tile = {
  id: 'dots-7',
  suit: 'dots',
  kind: 'number',
  face: '7',
  glyph: '🀟',
  baseValue: 7,
};

const dragonTile: Tile = {
  id: 'dragon-red',
  suit: 'dragon',
  kind: 'non-number',
  face: 'Red Dragon',
  glyph: '🀄',
  baseValue: 0,
};

describe('TileComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TileComponent] });
  });

  it('renders a number tile with its base value', async () => {
    const fixture = TestBed.createComponent(TileComponent);
    fixture.componentRef.setInput('tile', numberTile);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('🀟');
    expect(el.textContent).toContain('7');
  });

  it('renders a non-number tile using an explicit value override', async () => {
    const fixture = TestBed.createComponent(TileComponent);
    fixture.componentRef.setInput('tile', dragonTile);
    fixture.componentRef.setInput('value', 8);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('🀄');
    expect(el.textContent).toContain('Red Dragon');
    expect(el.textContent).toContain('8');
  });

  it('applies the size class to the host element', async () => {
    const fixture = TestBed.createComponent(TileComponent);
    fixture.componentRef.setInput('tile', numberTile);
    fixture.componentRef.setInput('size', 'sm');
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('tile--sm')).toBe(true);
  });
});
