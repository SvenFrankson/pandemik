import { Pandemik } from "./pandemik";
import { Player } from "./player";
import { City } from "./city";
import { DiseaseNames, GameColor } from "./data";
import { BreakingInfo } from "./ui-connectors/breaking-news-connector";
import { NextFrame } from "babylonjs-tiaratumgames-tools";
import { signal } from "@angular/core";
import { PlayerCard } from "./deck/deck";

export class GameMaster {;

    private __working: boolean = false;
    private get _working() {
        return this.__working;
    }
    private set _working(value: boolean) {
        this.__working = value;
        this.canPressDone.set(!value);
    }

    canPressDone = signal<boolean>(false);

    constructor(public pandemik: Pandemik) {
        this._working = false;
    }

    public canMoveTo(player: Player, destination: City): boolean {
        let dist = player.currentCity?.distanceTo[destination.cityId];
        return dist > 0 && dist <= player.availableAPs();
    }

    public getPathTo(player: Player, destination: City): City[] {
        const path: City[] = [];
        let currentCity: City | null = player.currentCity;
        let found = false;
        while (!found && currentCity) {
            let bestDist = Infinity;
            let closestCity = null;
            for (const cityLink of currentCity.links) {
                const otherCity = cityLink.other(currentCity);
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
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
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
                player.consumeAP(1);
                await player.goTo(city, undefined, city != destination);
            }
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canCureDisease(player: Player, city: City, diseaseColor: GameColor): boolean {
        if (player.availableAPs() >= 1) {
            if (player.currentCity === city) {
                if (city.infections[diseaseColor]() > 0)
                    return true;
            }
        }
        return false;
    }

    public async doCureDisease(player: Player, city: City, diseaseColor: GameColor): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canCureDisease(player, city, diseaseColor)) {
            player.consumeAP(1);
            await city.cure(diseaseColor);
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canBuildStation(player: Player, city: City): boolean {
        if (player.availableAPs() >= 1) {
            if (player.currentCity === city) {
                if (!city.hasStation) {
                    return true;
                }
            }
        }
        return false;
    }

    public async doBuildStation(player: Player, city: City): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canBuildStation(player, city)) {
            this.pandemik.breakingNewsConnector.addBreakingInfo(
                new BreakingInfo("Research station built.", city)
            )
            player.consumeAP(1);
            await city.buildStation();
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public async infect(city: City, diseaseColor: GameColor, count: number): Promise<void> {
        await this.pandemik.gameCamera.goTo(city.position, 1, 20, 5);
        let promises = [];
        for (let i = 0; i < count; i++) {
            promises.push(city.infect(diseaseColor));
        }
        let text = "";
        if (count === 1) {
            text = "A new " + DiseaseNames[diseaseColor].toLocaleUpperCase() + " infection.";
        }
        else if (count === 2) {
            text = "Multiple " + DiseaseNames[diseaseColor].toLocaleUpperCase() + " cases.";
        }
        else if (count >= 3) {
            text = "Major " + DiseaseNames[diseaseColor].toLocaleUpperCase() + " outbreak.";
        }
        this.pandemik.breakingNewsConnector.addBreakingInfo(
            new BreakingInfo(text, city)
        )
        await Promise.all(promises);
    }

    public async doDrawPlayerCard(player: Player): Promise<PlayerCard | null> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        let card = this.pandemik.playerDeck!.drawCard();
        if (card) {
            player.addPlayerCard(card);
            this._working = false;
            return card;
        }
        this._working = false;
        return null;
    }

    public async onDone(): Promise<void> {
        while (this._working) {
            await NextFrame();
        }
        await this.doDrawPlayerCard(this.pandemik.currentPlayer!);
        await this.doDrawPlayerCard(this.pandemik.currentPlayer!);
        this._working = true;
        const draws = 2;
        for (let n = 0; n < draws; n++) {
            let card = this.pandemik.infectionDeck!.drawCard();
            if (card) {
                let city = this.pandemik.map!.cities[card.cityId];
                await this.pandemik.gameMaster.infect(city, card.diseaseColor, 1);
            }
        }
        if (this.pandemik.currentPlayer!) {
            this.pandemik.currentPlayer.setAvailableAPs(4);
            await this.pandemik.gameCamera.goTo(this.pandemik.currentPlayer.currentCity.position, 1, 25);
        }
        this._working = false;
    }
}