import { GameColor, CityDataList, CityDataById } from '../data';
import { Card, PlayerCard } from './deck';

export class CityCard extends PlayerCard {

    public static Instances: CityCard[] = [];

    constructor(public cityId: string) {
        super(CityDataById(cityId).name, CityDataById(cityId).color);
        this.img.set(CityDataById(cityId).img ?? "");
        CityCard.Instances.push(this);
    }

    public redrawImg(): void {
        this.img.set(CityDataById(this.cityId).img ?? "");
    }
}

export class JokerCard extends PlayerCard {

    constructor() {
        super("Research Paper", GameColor.Joker);
    }
}