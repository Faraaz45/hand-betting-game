import { Injectable, inject } from '@angular/core';
import { Tile } from '../models/tile.model';
import { DECK_FACTORY } from './deck-factory';

@Injectable({ providedIn: 'root' })
export class DeckService {
  private readonly deckFactory = inject(DECK_FACTORY);

  createDeck(): Tile[] {
    return this.deckFactory.createDeck();
  }

  shuffle<T>(items: ReadonlyArray<T>): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Reshuffle: add a fresh deck, combine with the discard pile, shuffle.
   * Mahjong glyphs are repeating; tiles are stateless identity-by-id so a fresh
   * deck "tops up" the pile rather than literally replacing it.
   */
  reshuffle(discardPile: ReadonlyArray<Tile>): Tile[] {
    return this.shuffle([...this.createDeck(), ...discardPile]);
  }
}
