import { GameColor } from "../data";

export class Card {

    constructor(public name: string) {
    
    }
}

export class PlayerCard extends Card {

    public color: GameColor | null = null;
    
    constructor(name: string, color: GameColor | null = null) {
        super(name);
        this.color = color;
    }
}

export class Deck<T extends Card> {

    public cards: T[] = [];
    public get count(): number {
        return this.cards.length;
    }

    constructor() {
        this.cards = [];
    }

    public addCard(card: T): void {
        this.cards.push(card);
    }

    public drawCard(): T | undefined {
        return this.cards.pop();
    }

    public drawBottomCard(): T | undefined {
        return this.cards.shift();
    }

    public shuffle(): void {
        for (let n = 0; n < 2; n++) {
            for (let i = 0; i < this.cards.length; i++) {
                let j = Math.floor(Math.random() * this.cards.length);
                let c1 = this.cards[i];
                let c2 = this.cards[j];
                this.cards[i] = c2;
                this.cards[j] = c1;
            }
        }
    }
}