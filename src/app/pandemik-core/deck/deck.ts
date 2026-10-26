export class Card {

    constructor(public name: string) {
    
    }
}

export class Deck<T extends Card> {

    public cards: T[] = [];

    constructor() {
        this.cards = [];
    }

    public addCard(card: T): void {
        this.cards.push(card);
    }

    public drawCard(): T | undefined {
        return this.cards.pop();
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