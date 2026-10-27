import { Pandemik } from "./pandemik";
import { Player } from "./player";
import { City } from "./city";
import { CityColor } from "./data";

export class GameMaster {

    constructor(public pandemik: Pandemik) {

    }

    public canMoveTo(player: Player, destination: City): boolean {
        let dist = player.currentCity?.distanceTo[destination.cityId];
        return dist > 0 && dist <= 4;
    }

    public moveToCost(player: Player, destination: City): number {
        let dist = player.currentCity?.distanceTo[destination.cityId];
        return dist ?? 0;
    }

    public async doMove(player: Player, destination: City): Promise<boolean> {
        if (this.canMoveTo(player, destination)) {
            await player.goTo(destination);
            return true;
        }
        return false;
    }

    public canCureDisease(player: Player, city: City, diseaseColor: CityColor): boolean {
        if (player.currentCity === city) {
            if (city.infections[diseaseColor]() > 0)
                return true;
        }
        return false;
    }

    public async doCureDisease(player: Player, city: City, diseaseColor: CityColor): Promise<boolean> {
        if (this.canCureDisease(player, city, diseaseColor)) {
            await city.cure(diseaseColor);
            return true;
        }
        return false;
    }

    public canBuildStation(player: Player, city: City): boolean {
        if (player.currentCity === city) {
            if (!city.hasStation) {
                return true;
            }
        }
        return false;
    }

    public async doBuildStation(player: Player, city: City): Promise<boolean> {
        if (this.canBuildStation(player, city)) {
            await city.buildStation();
            return true;
        }
        return false;
    }
}