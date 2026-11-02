import { GameColor, CityDataList, CityDataById } from '../data';
import { Card, PlayerCard } from './deck';

export class CityCard extends PlayerCard {

    constructor(public cityId: string) {
        super(CityDataById(cityId).name, CityDataById(cityId).color);
    }
}

export class JokerCard extends PlayerCard {

    constructor() {
        super("Research Paper", GameColor.Joker);
    }
}