import { CityColor, CityID, MapData } from '../data';
import { Card } from './deck';

export class InfectionCard extends Card {

    public diseaseColor: CityColor;

    constructor(public cityId: CityID) {
        super(MapData[cityId].name);
        this.diseaseColor = MapData[cityId].color;
    }
}