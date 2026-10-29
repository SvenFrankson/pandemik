import { GameColor, CityDataList, CityDataById } from '../data';
import { Card, PlayerCard } from './deck';

export class CityCard extends PlayerCard {

    constructor(public cityId: string) {
        super(CityDataById(cityId).name, CityDataById(cityId).color);
    }
}