import { Pandemik } from "./pandemik";
import { Player } from "./player";
import { City } from "./city";
import { DiseaseNames, GameColor } from "./data";
import { BreakingInfo } from "./ui-connectors/breaking-news-connector";
import { NextFrame } from "babylonjs-tiaratumgames-tools";
import { signal } from "@angular/core";
import { PlayerCard } from "./deck/deck";
import { CityCard } from "./deck/city-card";
import { EpidemyCard as EpidemicCard } from "./deck/epidemic-card";

export enum CanDoStatus {
    OK = 0,
    NOT_ENOUGH_AP,
    NO_AND_FUCK_YOU,
    NOT_IN_CURRENT_CITY,
    NO_REQUIRED_CARD,
    NO_INFECTION,
}

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

    public canCureDisease(player: Player, city: City, diseaseColor: GameColor): CanDoStatus {
        if (city.infections[diseaseColor]() < 1) {
            return CanDoStatus.NO_INFECTION;
        }

        if (player.currentCity != city) {
            return CanDoStatus.NOT_IN_CURRENT_CITY;
        }

        if (player.availableAPs() < 1) {
            return CanDoStatus.NOT_ENOUGH_AP;
        }
        
        return CanDoStatus.OK;
    }

    public async doCureDisease(player: Player, city: City, diseaseColor: GameColor): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canCureDisease(player, city, diseaseColor) === CanDoStatus.OK) {
            player.consumeAP(1);
            await city.cure(diseaseColor);
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canBuildStation(player: Player, city: City): CanDoStatus {
        if (city.hasStation) {
            return CanDoStatus.NO_AND_FUCK_YOU;
        }

        const playerCard = player.playerCards().find(card => {
            return card instanceof CityCard && card.cityId === city.cityId;
        });
        if (!playerCard) {
            return CanDoStatus.NO_REQUIRED_CARD;
        }

        if (player.currentCity !== city) {
            return CanDoStatus.NOT_IN_CURRENT_CITY;
        }

        if (player.availableAPs() < 1) {
            return CanDoStatus.NOT_ENOUGH_AP;
        }

        return CanDoStatus.OK;
    }

    public async doBuildStation(player: Player, city: City): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canBuildStation(player, city) === CanDoStatus.OK) {
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

    public async infect(city: City, diseaseColor: GameColor, count: number, skipCam: boolean = false): Promise<void> {
        if (!skipCam) {
            await this.pandemik.gameCamera.goTo(city.position, 1, 20, 4);
        }

        let currentInfection = city.infections[diseaseColor]();
        if (currentInfection + count <= 3) {
            let promises = [];
            for (let i = 0; i < count; i++) {
                promises.push(city.infect(diseaseColor));
            }
            await Promise.all(promises);
        }
        else {
            await this.pandemik.gameCamera.goTo(city.position, 1, 30);
            this.pandemik.breakingNewsConnector.addBreakingInfo(
                new BreakingInfo("Outbreak in " + city.name + ". Situation out of control.", city)
            )
            city.outbreaking = true;
            await city.outbreakAnimate(diseaseColor);
            count = 3 - currentInfection;
            let promises = [];
            for (let i = 0; i < count; i++) {
                promises.push(city.infect(diseaseColor));
            }
            if (promises.length > 0) {
                await Promise.all(promises);
            }
            promises = [];
            let text = "It spreads to ";
            for (const link of city.links) {
                const otherCity = link.other(city);
                if (otherCity && !otherCity.outbreaking) {
                    promises.push(this.infect(otherCity, diseaseColor, 1, true));
                    text += otherCity.name + ", ";
                }
            }
            this.pandemik.breakingNewsConnector.addBreakingInfo(
                new BreakingInfo(text.slice(0, -2) + ". +1", city)
            )
            if (promises.length > 0) {
                await Promise.all(promises);
            }
        }
    }

    public async doDrawPlayerCard(player: Player): Promise<PlayerCard | null> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        let card = this.pandemik.playerDeck!.drawCard();
        if (card instanceof CityCard) {
            if (player.playerCards().length < 7) {
                player.addPlayerCard(card);
            }
            this._working = false;
            return card;
        }
        else if (card instanceof EpidemicCard) {
            await this.doEpidemic();
            this._working = false;
            return card;
        }
        this._working = false;
        return null;
    }

    public async doEpidemic(): Promise<void> {
        let infectionCard = this.pandemik.infectionDeck!.drawBottomCard();
        if (infectionCard) {
            this.pandemik.infectionDiscardPile!.addCard(infectionCard);
            let city = this.pandemik.map!.cities[infectionCard.cityId];
            this.pandemik.breakingNewsConnector.addBreakingInfo(
                new BreakingInfo(DiseaseNames[infectionCard.diseaseColor].toLocaleUpperCase() + " epidemic. +3", city)
            )
            await this.pandemik.gameMaster.infect(city, infectionCard.diseaseColor, 3);
            for (const city of this.pandemik.map!.cities) {
                city.outbreaking = false;
            }
        }
        this.pandemik.infectionDiscardPile!.shuffle();
        while (this.pandemik.infectionDiscardPile!.count > 0) {
            let card = this.pandemik.infectionDiscardPile!.drawBottomCard();
            if (card) {
                this.pandemik.infectionDeck!.addCard(card);
            }
        }
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
                this.pandemik.infectionDiscardPile!.addCard(card);
                let city = this.pandemik.map!.cities[card.cityId];
                this.pandemik.breakingNewsConnector.addBreakingInfo(
                    new BreakingInfo(DiseaseNames[card.diseaseColor].toLocaleUpperCase() + " infection. +1", city)
                )
                await this.pandemik.gameMaster.infect(city, card.diseaseColor, 1);
                for (const city of this.pandemik.map!.cities) {
                    city.outbreaking = false;
                }
            }
        }
        if (this.pandemik.currentPlayer!) {
            this.pandemik.currentPlayer.setAvailableAPs(4);
            await this.pandemik.gameCamera.goTo(this.pandemik.currentPlayer.currentCity.position, 1, 25);
        }
        this._working = false;
    }
}