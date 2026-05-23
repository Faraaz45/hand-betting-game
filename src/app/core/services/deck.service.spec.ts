import { TestBed } from '@angular/core/testing';
import { DeckService } from './deck.service';
import { StandardMahjongDeckFactory } from './deck-factory';

describe('DeckService', () => {
  let service: DeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckService);
  });

  describe('createDeck', () => {
    it('creates a deck of 136 tiles (standard Mahjong count)', () => {
      const deck = service.createDeck();
      expect(deck.length).toBe(136);
    });

    it('contains 108 number tiles (3 suits × 9 values × 4 copies)', () => {
      const deck = service.createDeck();
      const numbers = deck.filter((t) => t.kind === 'number');
      expect(numbers.length).toBe(108);
    });

    it('contains 12 dragon tiles (3 dragons × 4 copies)', () => {
      const deck = service.createDeck();
      const dragons = deck.filter((t) => t.suit === 'dragon');
      expect(dragons.length).toBe(12);
    });

    it('contains 16 wind tiles (4 winds × 4 copies)', () => {
      const deck = service.createDeck();
      const winds = deck.filter((t) => t.suit === 'wind');
      expect(winds.length).toBe(16);
    });

    it('uses stable ids per tile face (duplicates share an id)', () => {
      const deck = service.createDeck();
      const eastWinds = deck.filter((t) => t.id === 'wind-east');
      expect(eastWinds.length).toBe(4);
      expect(new Set(eastWinds.map((t) => t.id)).size).toBe(1);
    });

    it('assigns face value to number tiles via baseValue', () => {
      const deck = service.createDeck();
      const sevenDots = deck.find((t) => t.id === 'dots-7');
      expect(sevenDots?.baseValue).toBe(7);
    });
  });

  describe('shuffle', () => {
    it('preserves all items', () => {
      const input = Array.from({ length: 50 }, (_, i) => i);
      const shuffled = service.shuffle(input);
      expect(shuffled.length).toBe(input.length);
      expect([...shuffled].sort((a, b) => a - b)).toEqual(input);
    });

    it('does not mutate the input', () => {
      const input = [1, 2, 3, 4, 5];
      const snapshot = [...input];
      service.shuffle(input);
      expect(input).toEqual(snapshot);
    });
  });

  describe('reshuffle', () => {
    it('combines a fresh deck with the discard pile', () => {
      const factory = new StandardMahjongDeckFactory();
      const discard = factory.createDeck().slice(0, 10);
      const reshuffled = service.reshuffle(discard);
      expect(reshuffled.length).toBe(136 + 10);
    });
  });
});
