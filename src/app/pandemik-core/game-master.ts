import { Pandemik } from "./pandemik";
import { Player } from "./player";
import { City } from "./city";
import { CityColor } from "./data";

export class GameMaster {

    constructor(public pandemik: Pandemik) {

    }

    public canMoveTo(player: Player, destination: City): boolean {
        return player.currentCity?.getLink(destination) != null;
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
}