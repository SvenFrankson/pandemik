import { signal } from "@angular/core";
import { City } from "../city";
import { Pandemik } from "../pandemik";
import { GameColor, GameColors } from "../data";
import { CanDoStatus, GameMaster } from "../game-master";
import { Player } from "../player";

export class CityActionMenuConnector {

    public get gameMaster(): GameMaster {
        return this.pandemik.gameMaster;
    }

    private _city: City | null = null;
    public get city(): City | null {
        return this._city;
    }
    public set city(city: City | null) {
        this._city = city;
        this.update();
        if (city) {
        }
        else {
        }
    }

    playerCount = signal<number>(0);
    shown = signal<boolean>(false);
    canGoTo = signal<boolean>(false);
    goToCost = signal<number>(1);
    canFlyTo = signal<number>(0);
    canUseAirplaneCard = signal<number>(0);
    canCharterFlyTo = signal<number>(1);
    canCureDisease = [signal<number>(0), signal<number>(0), signal<number>(0), signal<number>(0)];
    canBuildResearchStation = signal<CanDoStatus>(CanDoStatus.NO_AND_FUCK_YOU);
    canResearchDisease = [signal<number>(0), signal<number>(0), signal<number>(0), signal<number>(0)];
    canGiveCard = [signal<CanDoStatus>(CanDoStatus.NO_AND_FUCK_YOU)];
    canTakeCard = [signal<CanDoStatus>(CanDoStatus.NO_AND_FUCK_YOU)];
    canUseTaskForceCard = signal<number>(0);
    canUseResearchCenterCard = signal<number>(0);
    screenX = signal<number>(0);
    screenY = signal<number>(0);

    constructor(public pandemik: Pandemik) {
        pandemik.onPlayerAdded.push(() => {
            this.canGiveCard = this.pandemik.players.map(() => signal<CanDoStatus>(CanDoStatus.NO_AND_FUCK_YOU));
            this.canTakeCard = this.pandemik.players.map(() => signal<CanDoStatus>(CanDoStatus.NO_AND_FUCK_YOU));
        });
    }

    update(): void {
        this.playerCount.set(this.gameMaster.pandemik.players.length);

        if (this._city != null && this.pandemik.gameMaster.currentPlayer) {
            this.shown.set(true);

            this.screenX.set(this._city.screenEastX());
            this.screenY.set(this._city.screenEastY());
            this.screenX = this._city.screenEastX;
            this.screenY = this._city.screenEastY;

            this.canGoTo.set(this.gameMaster.canMoveTo(this.pandemik.gameMaster.currentPlayer, this._city));
            this.goToCost.set(this.gameMaster.moveToCost(this.pandemik.gameMaster.currentPlayer, this._city));
            for (const c of GameColors) {
                this.canCureDisease[c].set(this.gameMaster.canTreatDisease(this.pandemik.gameMaster.currentPlayer, this._city, c));
                this.canResearchDisease[c].set(this.gameMaster.canResearchDisease(this.pandemik.gameMaster.currentPlayer, this._city, c));
            }
            this.canFlyTo.set(this.gameMaster.canFlyTo(this.pandemik.gameMaster.currentPlayer, this._city));
            this.canUseAirplaneCard.set(this.gameMaster.canUseAirplaneCard(this.pandemik.gameMaster.currentPlayer, this._city));
            this.canCharterFlyTo.set(this.gameMaster.canCharterFlyTo(this.pandemik.gameMaster.currentPlayer, this._city));
            this.canBuildResearchStation.set(this.gameMaster.canBuildStation(this.pandemik.gameMaster.currentPlayer, this._city));
            for (const player of this.gameMaster.pandemik.players) {
                if (player !== this.pandemik.gameMaster.currentPlayer) {
                    this.canGiveCard[player.index].set(this.gameMaster.canGiveCard(this.pandemik.gameMaster.currentPlayer, player, this._city));
                    this.canTakeCard[player.index].set(this.gameMaster.canTakeCard(this.pandemik.gameMaster.currentPlayer, player, this._city));
                }
                else {
                    this.canGiveCard[player.index].set(CanDoStatus.NO_AND_FUCK_YOU);
                    this.canTakeCard[player.index].set(CanDoStatus.NO_AND_FUCK_YOU);
                }
            }
            this.canUseTaskForceCard.set(this.gameMaster.canUseTaskForceCard(this.pandemik.gameMaster.currentPlayer, this._city));
            this.canUseResearchCenterCard.set(this.gameMaster.canUseResearchCenterCard(this.pandemik.gameMaster.currentPlayer, this._city));
        }
        else {
            this.shown.set(false);
            this.screenX.set(0);
            this.screenY.set(0);
        }
    }

    async onGoTo(): Promise<void> {
        //this.shown.set(false);
        if (this._city) {
            await this.gameMaster.doMove(this.pandemik.gameMaster.currentPlayer!, this._city);
        }
        this.update();
    }

    async onFly(): Promise<void> {
        //this.shown.set(false);
        if (this._city) {
            await this.gameMaster.doFly(this.pandemik.gameMaster.currentPlayer!, this._city);
        }
        this.update();
    }

    async onCharterFly(): Promise<void> {
        //this.shown.set(false);
        if (this._city) {
            await this.gameMaster.doCharterFly(this.pandemik.gameMaster.currentPlayer!, this._city);
        }
        this.update();
    }

    async onUseAirplaneCard(): Promise<void> {
        //this.shown.set(false);
        if (this._city) {
            await this.gameMaster.doUseAirplaneCard(this.pandemik.gameMaster.currentPlayer!, this._city);
        }
        this.update();
    }

    async onCureDisease(diseaseColor: GameColor): Promise<void> {
        //this.shown.set(false);
        if (this._city) {
            await this.gameMaster.doTreatDisease(this.pandemik.gameMaster.currentPlayer!, this._city, diseaseColor);
        }
        this.update();
    }

    async onBuildResearchStation(): Promise<void> {
        //this.shown.set(false);
        if (this._city) {
            await this.gameMaster.doBuildStation(this.pandemik.gameMaster.currentPlayer!, this._city);
        }
        this.update();
    }

    async onGiveCard(playerIndex: number): Promise<void> {
        if (this._city) {
            await this.gameMaster.doGiveCard(this.pandemik.gameMaster.currentPlayer!, this.pandemik.players[playerIndex], this._city);
        }
        this.update();
    }
    
    async onTakeCard(playerIndex: number): Promise<void> {
        if (this._city) {
            await this.gameMaster.doTakeCard(this.pandemik.gameMaster.currentPlayer!, this.pandemik.players[playerIndex], this._city);
        }
        this.update();
    }

    async onResearchDisease(diseaseColor: GameColor): Promise<void> {
        if (this._city) {
            await this.gameMaster.doResearchDisease(this.pandemik.gameMaster.currentPlayer!, this._city, diseaseColor);
        }
        this.update();
    }

    async onUseTaskForceCard(): Promise<void> {
        if (this._city) {
            await this.gameMaster.doUseTaskForceCard(this.pandemik.gameMaster.currentPlayer!, this._city);
        }
        this.update();
    }

    async onUseResearchCenterCard(): Promise<void> {
        if (this._city) {
            await this.gameMaster.doUseResearchCenterCard(this.pandemik.gameMaster.currentPlayer!, this._city);
        }
        this.update();
    }
}