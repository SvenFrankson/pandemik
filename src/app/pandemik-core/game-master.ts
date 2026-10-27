import { Pandemik } from "./pandemik";
import { Player } from "./player";
import { City } from "./city";
import { CityColor } from "./data";
import { BreakingInfo } from "./ui-connectors/breaking-news-connector";

export class GameMaster {;

    constructor(public pandemik: Pandemik) {

    }

    public canMoveTo(player: Player, destination: City): boolean {
        let dist = player.currentCity?.distanceTo[destination.cityId];
        return dist > 0 && dist <= 4;
    }

    public getPathTo(player: Player, destination: City): City[] {
        const path: City[] = [];
        let currentCity: City | null = player.currentCity;
        let found = false;
        while (!found && currentCity) {
            let bestDist = Infinity;
            let closestCity = null;
            for (const link of currentCity.links) {
                const otherCity = link.other(currentCity);
                if (otherCity) {
                    const dist = otherCity.distanceTo[destination.cityId];
                    if (dist < bestDist) {
                        bestDist = dist;
                        closestCity = otherCity;
                    }
                }
            }
            if (closestCity) {
                path.push(closestCity);
                currentCity = closestCity;
                if (currentCity === destination) {
                    found = true;
                }
            }
            else {
                currentCity = null;
            }
        }
        return path;
    }

    public moveToCost(player: Player, destination: City): number {
        let dist = player.currentCity?.distanceTo[destination.cityId];
        return dist ?? 0;
    }

    public async doMove(player: Player, destination: City): Promise<boolean> {
        if (this.canMoveTo(player, destination)) {
            const path = this.getPathTo(player, destination);
            if (path.length === 0) {
                console.log(`No path found from ${player.currentCity?.cityId} to ${destination.cityId}`);
                return false;
            }
            if (path[path.length - 1] !== destination) {
                console.log(`Path does not lead to destination: ${player.currentCity?.cityId} -> ${destination.cityId}`);
                return false;
            }
            for (const city of path) {
                await player.goTo(city, undefined, city != destination);
            }
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

    public async infect(city: City, diseaseColor: CityColor, count: number): Promise<void> {
        await this.pandemik.gameCamera!.goTo(city.position, 1, 20, 5);
        let promises = [];
        for (let i = 0; i < count; i++) {
            promises.push(city.infect(diseaseColor));
        }
        let text = "";
        if (count === 1) {
            text = "Infection in " + city.name + ".";
        }
        else if (count === 2) {
            text = "Many cases in " + city.name + " !";
        }
        else if (count >= 3) {
            text = "Major outbreak in " + city.name + " !";
        }
        this.pandemik.breakingNewsConnector.addBreakingInfo(
            new BreakingInfo(text)
        )
        await Promise.all(promises);
    }
}