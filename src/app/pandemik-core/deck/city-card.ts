import { GameColor, CityID, MapData } from '../data';
import { Card, PlayerCard } from './deck';

export class CityCard extends PlayerCard {

    constructor(public cityId: CityID) {
        super(MapData[cityId].name, MapData[cityId].color);
    }
}