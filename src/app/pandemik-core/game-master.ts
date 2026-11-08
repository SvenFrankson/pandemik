import { Pandemik } from "./pandemik";
import { Medic, Player, Scientist } from "./player";
import { City } from "./city";
import { CityIdToIndex, DiseaseNames, GameColor, GameColors } from "./data";
import { BreakingInfo } from "./ui-connectors/breaking-news-connector";
import { NextFrame } from "babylonjs-tiaratumgames-tools";
import { signal } from "@angular/core";
import { EpidemyCard as EpidemicCard } from "./deck/epidemic-card";
import { CityCard, ResearchJokerCard, PlayerCard, AirplaneCard, TaskForceCard, JokerCard, ResearchCenterCard } from "./deck/player-card";

export enum CanDoStatus {
    OK = 0,
    NOT_ENOUGH_AP,
    NO_AND_FUCK_YOU,
    NOT_IN_CURRENT_CITY,
    NO_REQUIRED_CARD,
    NO_INFECTION,
    NO_NEED,
    NO_ENOUGH_HAND_SPACE,
    NO_RESEARCH_STATION
}

export enum DiseaseStatus {
    ACTIVE = 0,
    RESEARCHED,
    ERADICATED
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

    public currentPlayerIndex = signal<number>(0);
    public get currentPlayer(): Player | null {
        return this.pandemik.players.length > 0 ? this.pandemik.players[this.currentPlayerIndex()] : null;
    }

    currentTurn = signal<number>(1);
    playerDeckSize = signal<number>(0);
    outbreaksCount = signal<number>(0);
    canPressDone = signal<boolean>(false);
    diseaseStatuses = [signal<DiseaseStatus>(DiseaseStatus.ACTIVE), signal<DiseaseStatus>(DiseaseStatus.ACTIVE), signal<DiseaseStatus>(DiseaseStatus.ACTIVE), signal<DiseaseStatus>(DiseaseStatus.ACTIVE)];
    infectionsCounts = [signal<number>(0), signal<number>(0), signal<number>(0), signal<number>(0)];

    constructor(public pandemik: Pandemik) {
        this._working = false;
    }

    public updateInfectionsCounts(): void {
        for (let diseaseColor = 0; diseaseColor < 4; diseaseColor++) {
            this.infectionsCounts[diseaseColor].set(this.pandemik.map?.totalInfections(diseaseColor) ?? 0);
        }
    }

    public async doMedicFreeTreatmentStep(): Promise<void> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        const medic = this.pandemik.players.find(p => p instanceof Medic);
        if (medic instanceof Medic) {
            const city = medic.currentCity;
            for (const diseaseColor of GameColors) {
                if (this.diseaseStatuses[diseaseColor]() === DiseaseStatus.RESEARCHED) {
                    this._working = false;
                    await this.doTreatDisease(medic, city, diseaseColor, true);
                    this.__working = true;
                }
            }
        }
        this._working = false;
    }

    public isCityProtected(city: City, diseaseColor: GameColor): Player | null {
        const medic = this.pandemik.players.find(p => p instanceof Medic);
        if (medic instanceof Medic) {
            if (medic.currentCity === city) {
                if (this.diseaseStatuses[diseaseColor]() === DiseaseStatus.RESEARCHED) {
                    return medic;
                }
            }
        }
        return null;
    }

    public canMoveTo(player: Player, destination: City): boolean {
        let dist = player.currentCity?.distanceTo[CityIdToIndex(destination.cityId)];
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
                    const dist = otherCity.distanceTo[CityIdToIndex(destination.cityId)];
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
        let dist = player.currentCity?.distanceTo[CityIdToIndex(destination.cityId)];
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
                if (player instanceof Medic) {
                    this.__working = false;
                    for (const diseaseColor of GameColors) {
                        if (this.diseaseStatuses[diseaseColor]() === DiseaseStatus.RESEARCHED) {
                            await this.doTreatDisease(player, city, diseaseColor, true);
                        }
                    }
                    this.__working = true;
                }
            }
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canFlyTo(player: Player, destination: City): CanDoStatus {
        let dist = player.currentCity?.distanceTo[CityIdToIndex(destination.cityId)];
        if (dist <= 1) {
            return CanDoStatus.NO_NEED;
        }

        if (player.availableAPs() < 1) {
            return CanDoStatus.NOT_ENOUGH_AP;
        }

        const playerCard = player.playerCards().find(card => {
            return card instanceof CityCard && card.cityId === destination.cityId;
        });
        if (!playerCard) {
            return CanDoStatus.NO_REQUIRED_CARD;
        }

        return CanDoStatus.OK;
    }

    public async doFly(player: Player, destination: City): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canFlyTo(player, destination) === CanDoStatus.OK) {
            player.consumeAP(1);
            const playerCard = player.playerCards().find(card => {
                return card instanceof CityCard && card.cityId === destination.cityId;
            });
            if (playerCard) {
                player.removePlayerCard(playerCard);
                this.pandemik.playerDiscardPile?.addCard(playerCard);
            }
            await player.goTo(destination);
            if (player instanceof Medic) {
                this.__working = false;
                for (const diseaseColor of GameColors) {
                    if (this.diseaseStatuses[diseaseColor]() === DiseaseStatus.RESEARCHED) {
                        await this.doTreatDisease(player, destination, diseaseColor, true);
                    }
                }
                this.__working = true;
            }
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canCharterFlyTo(player: Player, destination: City): CanDoStatus {
        let dist = player.currentCity?.distanceTo[CityIdToIndex(destination.cityId)];
        if (dist <= 1) {
            return CanDoStatus.NO_NEED;
        }

        if (player.availableAPs() < 1) {
            return CanDoStatus.NOT_ENOUGH_AP;
        }

        const playerCard = player.playerCards().find(card => {
            return card instanceof CityCard && card.cityId === player.currentCity?.cityId;
        });
        if (!playerCard) {
            return CanDoStatus.NO_REQUIRED_CARD;
        }

        return CanDoStatus.OK;
    }

    public async doCharterFly(player: Player, destination: City): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canCharterFlyTo(player, destination) === CanDoStatus.OK) {
            player.consumeAP(1);
            const playerCard = player.playerCards().find(card => {
                return card instanceof CityCard && card.cityId === player.currentCity?.cityId;
            });
            if (playerCard) {
                player.removePlayerCard(playerCard);
                this.pandemik.playerDiscardPile?.addCard(playerCard);
            }
            await player.goTo(destination);
            if (player instanceof Medic) {
                this.__working = false;
                for (const diseaseColor of GameColors) {
                    if (this.diseaseStatuses[diseaseColor]() === DiseaseStatus.RESEARCHED) {
                        await this.doTreatDisease(player, destination, diseaseColor, true);
                    }
                }
                this.__working = true;
            }
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canTreatDisease(player: Player, city: City, diseaseColor: GameColor, freeAction: boolean = false): CanDoStatus {
        if (city.infections[diseaseColor]() < 1) {
            return CanDoStatus.NO_INFECTION;
        }

        if (player.currentCity != city) {
            return CanDoStatus.NOT_IN_CURRENT_CITY;
        }

        if (!freeAction && player.availableAPs() < 1) {
            return CanDoStatus.NOT_ENOUGH_AP;
        }
        
        return CanDoStatus.OK;
    }

    public async doTreatDisease(player: Player, city: City, diseaseColor: GameColor, freeAction: boolean = false): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canTreatDisease(player, city, diseaseColor, freeAction) === CanDoStatus.OK) {
            if (!freeAction) {
                player.consumeAP(1);
            }
            await city.cure(diseaseColor);
            if (player instanceof Medic) {
                while (city.infections[diseaseColor]() > 0) {
                    await city.cure(diseaseColor);
                }
            }
            if (this.diseaseStatuses[diseaseColor]() === DiseaseStatus.RESEARCHED) {
                while (city.infections[diseaseColor]() > 0) {
                    await city.cure(diseaseColor);
                }
                if (this.pandemik.map?.totalInfections(diseaseColor) === 0) {
                    this.diseaseStatuses[diseaseColor].set(DiseaseStatus.ERADICATED);
                }
            }
            this.updateInfectionsCounts();
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
                new BreakingInfo("Research station built.", city, 0, "hospital", this.currentTurn())
            )
            player.consumeAP(1);
            const playerCard = player.playerCards().find(card => {
                return card instanceof CityCard && card.cityId === city.cityId;
            });
            if (playerCard) {
                player.removePlayerCard(playerCard);
                this.pandemik.playerDiscardPile?.addCard(playerCard);
            }
            await city.buildStation();
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canGiveCard(player: Player, otherPlayer: Player, city: City): CanDoStatus {
        if (player.currentCity !== city) {
            return CanDoStatus.NOT_IN_CURRENT_CITY;
        }

        if (otherPlayer.currentCity !== city) {
            return CanDoStatus.NOT_IN_CURRENT_CITY;
        }

        const playerCard = player.playerCards().find(card => {
            return card instanceof CityCard && card.cityId === city.cityId;
        });
        if (!playerCard) {
            return CanDoStatus.NO_REQUIRED_CARD;
        }

        if (otherPlayer.playerCards().length >= 7) {
            return CanDoStatus.NO_ENOUGH_HAND_SPACE;
        }

        if (player.availableAPs() < 1) {
            return CanDoStatus.NOT_ENOUGH_AP;
        }

        return CanDoStatus.OK;
    }

    public async doGiveCard(player: Player, otherPlayer: Player, city: City): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canGiveCard(player, otherPlayer, city) === CanDoStatus.OK) {
            const playerCard = player.playerCards().find(card => {
                return card instanceof CityCard && card.cityId === city.cityId;
            });
            if (playerCard) {
                player.removePlayerCard(playerCard);
                player.consumeAP(1);
                otherPlayer.addPlayerCard(playerCard);
            }
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canTakeCard(player: Player, otherPlayer: Player, city: City): CanDoStatus {
        if (player.currentCity !== city) {
            return CanDoStatus.NOT_IN_CURRENT_CITY;
        }

        if (otherPlayer.currentCity !== city) {
            return CanDoStatus.NOT_IN_CURRENT_CITY;
        }

        const playerCard = otherPlayer.playerCards().find(card => {
            return card instanceof CityCard && card.cityId === city.cityId;
        });
        if (!playerCard) {
            return CanDoStatus.NO_REQUIRED_CARD;
        }

        if (player.playerCards().length >= 7) {
            return CanDoStatus.NO_ENOUGH_HAND_SPACE;
        }

        if (player.availableAPs() < 1) {
            return CanDoStatus.NOT_ENOUGH_AP;
        }

        return CanDoStatus.OK;
    }

    public async doTakeCard(player: Player, otherPlayer: Player, city: City): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canTakeCard(player, otherPlayer, city) === CanDoStatus.OK) {
            const playerCard = otherPlayer.playerCards().find(card => {
                return card instanceof CityCard && card.cityId === city.cityId;
            });
            if (playerCard) {
                otherPlayer.removePlayerCard(playerCard);
                player.consumeAP(1);
                player.addPlayerCard(playerCard);
            }
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canResearchDisease(player: Player, city: City, diseaseColor: GameColor): CanDoStatus {
        if (this.diseaseStatuses[diseaseColor]() !== DiseaseStatus.ACTIVE) {
            return CanDoStatus.NO_NEED;
        }

        if (player.currentCity !== city) {
            return CanDoStatus.NOT_IN_CURRENT_CITY;
        }

        if (!player.currentCity.hasStation) {
            return CanDoStatus.NO_RESEARCH_STATION;
        }
        const cards = player.playerCards().filter((card) => {
            return card instanceof CityCard && card.color === diseaseColor || card instanceof ResearchJokerCard;
        });
        const requiredCards = player instanceof Scientist ? 4 : 5;
        if (cards.length < requiredCards) {
            return CanDoStatus.NO_REQUIRED_CARD;
        }
        if (player.availableAPs() < 1) {
            return CanDoStatus.NOT_ENOUGH_AP;
        }
        return CanDoStatus.OK;
    }

    public async doResearchDisease(player: Player, city: City, diseaseColor: GameColor): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canResearchDisease(player, city, diseaseColor) === CanDoStatus.OK) {
            let cards = player.playerCards().filter((card) => {
                return card instanceof CityCard && card.color === diseaseColor || card instanceof ResearchJokerCard;
            });
            cards = cards.sort((a, b) => {
                if (a instanceof ResearchJokerCard) return 1;
                if (b instanceof ResearchJokerCard) return -1;
                return 0;
            });
            const requiredCards = player instanceof Scientist ? 4 : 5;
            for (let i = 0; i < requiredCards; i++) {
                player.removePlayerCard(cards[i]);
            }
            player.consumeAP(1);
            this.diseaseStatuses[diseaseColor].update(() => DiseaseStatus.RESEARCHED);
            if (this.pandemik.map?.totalInfections(diseaseColor) === 0) {
                this.diseaseStatuses[diseaseColor].set(DiseaseStatus.ERADICATED);
            }
            this._working = false;
            await this.doMedicFreeTreatmentStep();
            this._working = true;
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canUseAirplaneCard(player: Player, destination: City): CanDoStatus {
        let dist = player.currentCity?.distanceTo[CityIdToIndex(destination.cityId)];
        if (dist <= 0) {
            return CanDoStatus.NO_NEED;
        }

        const playerCard = player.playerCards().find(card => {
            return card instanceof AirplaneCard;
        });
        if (!playerCard) {
            return CanDoStatus.NO_REQUIRED_CARD;
        }

        return CanDoStatus.OK;
    }

    public async doUseAirplaneCard(player: Player, destination: City): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canUseAirplaneCard(player, destination) === CanDoStatus.OK) {
            const playerCard = player.playerCards().find(card => {
                return card instanceof AirplaneCard;
            });
            if (playerCard) {
                player.removePlayerCard(playerCard);
                this.pandemik.playerDiscardPile?.addCard(playerCard);
            }
            await player.goTo(destination);
            if (player instanceof Medic) {
                this.__working = false;
                await this.doMedicFreeTreatmentStep();
                this.__working = true;
            }
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canUseTaskForceCard(player: Player, targetCity: City): CanDoStatus {
        let infections = 0;
        for (const diseaseColor of GameColors) {
            infections += targetCity.infections[diseaseColor]();
        }
        if (infections <= 0) {
            return CanDoStatus.NO_NEED;
        }

        const playerCard = player.playerCards().find(card => {
            return card instanceof TaskForceCard;
        });
        if (!playerCard) {
            return CanDoStatus.NO_REQUIRED_CARD;
        }

        return CanDoStatus.OK;
    }

    public async doUseTaskForceCard(player: Player, targetCity: City): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canUseTaskForceCard(player, targetCity) === CanDoStatus.OK) {
            const playerCard = player.playerCards().find(card => {
                return card instanceof TaskForceCard;
            });
            if (playerCard) {
                player.removePlayerCard(playerCard);
                this.pandemik.playerDiscardPile?.addCard(playerCard);
            }
            for (const diseaseColor of GameColors) {
                while (targetCity.infections[diseaseColor]() > 0) {
                    await targetCity.cure(diseaseColor);
                    this.updateInfectionsCounts();
                }
                if (this.diseaseStatuses[diseaseColor]() === DiseaseStatus.RESEARCHED) {
                    if (this.pandemik.map?.totalInfections(diseaseColor) === 0) {
                        this.diseaseStatuses[diseaseColor].set(DiseaseStatus.ERADICATED);
                    }
                }
                this.updateInfectionsCounts();
            }
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public canUseResearchCenterCard(player: Player, targetCity: City): CanDoStatus {
        if (targetCity.hasStation) {
            return CanDoStatus.NO_NEED;
        }

        const playerCard = player.playerCards().find(card => {
            return card instanceof ResearchCenterCard;
        });
        if (!playerCard) {
            return CanDoStatus.NO_REQUIRED_CARD;
        }

        return CanDoStatus.OK;
    }

    public async doUseResearchCenterCard(player: Player, targetCity: City): Promise<boolean> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        if (this.canUseResearchCenterCard(player, targetCity) === CanDoStatus.OK) {
            const playerCard = player.playerCards().find(card => {
                return card instanceof ResearchCenterCard;
            });
            if (playerCard) {
                player.removePlayerCard(playerCard);
                this.pandemik.playerDiscardPile?.addCard(playerCard);
            }
            await targetCity.buildStation();
            this._working = false;
            return true;
        }
        this._working = false;
        return false;
    }

    public async infect(city: City, diseaseColor: GameColor, count: number, skipCam: boolean = false): Promise<void> {
        let random = city.name + "_" + (Math.random() * 10000).toFixed(0);
        let failState = "zero";
        let failCheck = setTimeout(() => {
            console.warn("Fail " + failState + " " + random);
        }, 10000);
        console.log("Starting infection " + random);
        if (!skipCam) {
            await this.pandemik.gameCamera.goTo(city.position, 1, 10 + this.pandemik.map!.projection.radius, 4);
        }
        failState = "after camera";

        let currentInfection = city.infections[diseaseColor]();
        if (currentInfection + count <= 3) {
            failState = "infecting normally";
            let promises = [];
            for (let i = 0; i < count; i++) {
                promises.push(city.infect(diseaseColor));
            }
            await Promise.all(promises);
            this.updateInfectionsCounts();
        }
        else {
            failState = "outbreak";
            if (!skipCam) {
                await this.pandemik.gameCamera.goTo(city.position, 1, 20 + this.pandemik.map!.projection.radius);
            }
            failState = "after camera for outbreak";
            this.pandemik.breakingNewsConnector.addBreakingInfo(
                new BreakingInfo(DiseaseNames[diseaseColor].toLocaleUpperCase() + " Outbreak !", city, 2, "danger", this.currentTurn())
            )
            city.outbreaking = true;
            this.outbreaksCount.update(n => n + 1);
            await city.outbreakAnimate(diseaseColor);
            failState = "after outbreak animation";
            count = 3 - currentInfection;
            let promises = [];
            for (let i = 0; i < count; i++) {
                promises.push(city.infect(diseaseColor));
            }
            if (promises.length > 0) {
                await Promise.all(promises);
            }
            this.updateInfectionsCounts();
            failState = "spreading to linked cities";
            promises = [];
            let text = "It spreads to ";
            let infectionsCount = 0;
            for (const link of city.links) {
                const otherCity = link.other(city);
                if (otherCity && !otherCity.outbreaking) {
                    if (this.isCityProtected(otherCity, diseaseColor) === null) {
                        promises.push(this.infect(otherCity, diseaseColor, 1, true));
                        text += otherCity.name + ", ";
                        infectionsCount++;
                    }
                }
            }
            this.pandemik.breakingNewsConnector.addBreakingInfo(
                new BreakingInfo(text.slice(0, -2) + ". +" + infectionsCount.toFixed(0), city, 2, "virus", this.currentTurn())
            )
            if (promises.length > 0) {
                await Promise.all(promises);
            }
            failState = "done spreading";
        }
        clearTimeout(failCheck);
        console.log("Ending infection " + random);
    }

    public async doDrawPlayerCard(player: Player): Promise<PlayerCard | null> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        let card = this.pandemik.playerDeck!.drawCard();
        if (card instanceof CityCard || card instanceof JokerCard) {
            if (player.playerCards().length < 8) {
                player.addPlayerCard(card);
            }
            this.playerDeckSize.set(this.pandemik.playerDeck!.count);
            this._working = false;
            return card;
        }
        else if (card instanceof EpidemicCard) {
            await this.doEpidemic();
            this.playerDeckSize.set(this.pandemik.playerDeck!.count);
            this._working = false;
            return card;
        }
        this._working = false;
        return null;
    }

    public async doDiscardPlayerCard(player: Player, cardIndex: number): Promise<void> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        let card = player.playerCards()[cardIndex];
        if (card) {
            player.removePlayerCard(card);
            this.pandemik.playerDiscardPile!.addCard(card);
        }
        this._working = false;
    }

    public async doEpidemic(): Promise<void> {
        let infectionCard = this.pandemik.infectionDeck!.drawBottomCard();
        if (infectionCard) {
            this.pandemik.infectionDiscardPile!.addCard(infectionCard);
            let city = this.pandemik.map!.getCityById(infectionCard.cityId);
            if (city) {
                if (this.diseaseStatuses[infectionCard.diseaseColor]() === DiseaseStatus.ERADICATED) {
                    new BreakingInfo(DiseaseNames[infectionCard.diseaseColor].toLocaleUpperCase() + " is eradicated. +0", city, 0, "stars", this.currentTurn())
                }
                else {
                    const protection = this.isCityProtected(city, infectionCard.diseaseColor);
                    if (protection) {
                        this.pandemik.breakingNewsConnector.addBreakingInfo(
                            new BreakingInfo(DiseaseNames[infectionCard.diseaseColor].toLocaleUpperCase() + " infection prevented by " + protection.name + ". +0", city, 0, "shield", this.currentTurn())
                        )
                    }
                    else {
                        this.pandemik.breakingNewsConnector.addBreakingInfo(
                            new BreakingInfo(DiseaseNames[infectionCard.diseaseColor].toLocaleUpperCase() + " epidemic. +3", city, 2, "virus", this.currentTurn())
                        )
                        await this.pandemik.gameMaster.infect(city, infectionCard.diseaseColor, 3);
                        for (const city of this.pandemik.map!.cities) {
                            city.outbreaking = false;
                        }
                    }
                }
            }
            else {
                console.warn(`City not found for infection card: ${infectionCard.cityId}`);
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

    public async startGame(): Promise<void> {
        while (this._working) {
            await NextFrame();
        }
        this._working = true;
        this.currentTurn.set(1);
        this.playerDeckSize.set(this.pandemik.playerDeck!.count);
        this.currentPlayerIndex.set(0);
        if (this.currentPlayer!) {
            this.currentPlayer.setAvailableAPs(this.currentPlayer.apPerTurn);
            await this.pandemik.gameCamera.goTo(this.currentPlayer.currentCity.position, 1, 15 + this.pandemik.map!.projection.radius);
        }
        this._working = false;
    }

    public async onDone(): Promise<void> {
        while (this._working) {
            await NextFrame();
        }
        this.pandemik.selectedCity = null;
        await this.doDrawPlayerCard(this.currentPlayer!);
        await this.doDrawPlayerCard(this.currentPlayer!);
        this._working = true;
        const draws = 2;
        for (let n = 0; n < draws; n++) {
            let card = this.pandemik.infectionDeck!.drawCard();
            if (card) {
                this.pandemik.infectionDiscardPile!.addCard(card);
                    let city = this.pandemik.map!.getCityById(card.cityId);
                    if (city) {
                        if (this.diseaseStatuses[card.diseaseColor]() === DiseaseStatus.ERADICATED) {
                            this.pandemik.breakingNewsConnector.addBreakingInfo(
                                new BreakingInfo(DiseaseNames[card.diseaseColor].toLocaleUpperCase() + " is eradicated. +0", city, 0, "stars", this.currentTurn())
                            )
                        }
                        else {
                            const protection = this.isCityProtected(city, card.diseaseColor);
                            if (protection) {
                                this.pandemik.breakingNewsConnector.addBreakingInfo(
                                    new BreakingInfo(DiseaseNames[card.diseaseColor].toLocaleUpperCase() + " infection prevented by " + protection.name + ". +0", city, 0, "shield", this.currentTurn())
                                )
                            }
                            else {
                                this.pandemik.breakingNewsConnector.addBreakingInfo(
                                    new BreakingInfo(DiseaseNames[card.diseaseColor].toLocaleUpperCase() + " infection. +1", city, 0, "virus", this.currentTurn())
                                )
                                await this.pandemik.gameMaster.infect(city, card.diseaseColor, 1);
                                for (const city of this.pandemik.map!.cities) {
                                    city.outbreaking = false;
                                }
                            }
                        }
                    }
                    else {
                        console.warn(`City not found for infection card: ${card.cityId}`);
                    }
            }
        }
        if (this.currentPlayer!) {
            this.currentPlayer.setAvailableAPs(0);
        }
        this.currentTurn.set(this.currentTurn() + 1);
        this.currentPlayerIndex.set((this.currentPlayerIndex() + 1) % this.pandemik.players.length);
        if (this.currentPlayer!) {
            this.currentPlayer.setAvailableAPs(this.currentPlayer.apPerTurn);
            await this.pandemik.gameCamera.goTo(this.currentPlayer.currentCity.position, 1, 15 + this.pandemik.map!.projection.radius);
        }
        this._working = false;
    }
}