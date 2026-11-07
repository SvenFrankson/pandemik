import { GameColor, CityDataList } from '../data';
import { Card } from './deck';
import { PlayerCard } from './player-card';

export class EpidemyCard extends PlayerCard {

    constructor() {
        super("epidemy");
    }
}