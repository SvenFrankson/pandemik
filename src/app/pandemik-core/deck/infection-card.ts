import { GameColor, CityDataList, CityDataById } from '../data';
import { Card } from './deck';

export class InfectionCard extends Card {

    public diseaseColor: GameColor;

    constructor(public cityId: string) {
        super(CityDataById(cityId).name);
        this.diseaseColor = CityDataById(cityId).color;
    }
}