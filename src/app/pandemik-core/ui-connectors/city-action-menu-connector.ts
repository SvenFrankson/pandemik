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
    canFlyTo = signal<number>(1);
    canCharterFlyTo = signal<number>(1);
    canCureDisease = [signal<number>(0), signal<number>(0), signal<number>(0), signal<number>(0)];
    canBuildResearchStation = signal<CanDoStatus>(CanDoStatus.NO_AND_FUCK_YOU);
    canGiveCard = [signal<CanDoStatus>(CanDoStatus.NO_AND_FUCK_YOU)];
    canTakeCard = [signal<CanDoStatus>(CanDoStatus.NO_AND_FUCK_YOU)];
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

        if (this._city != null && this.pandemik.currentPlayer) {
            this.shown.set(true);

            this.screenX.set(this._city.screenEastX());
            this.screenY.set(this._city.screenEastY());
            this.screenX = this._city.screenEastX;
            this.screenY = this._city.screenEastY;

            this.canGoTo.set(this.gameMaster.canMoveTo(this.pandemik.currentPlayer, this._city));
            this.goToCost.set(this.gameMaster.moveToCost(this.pandemik.currentPlayer, this._city));
            for (const c of GameColors) {
                this.canCureDisease[c].set(this.gameMaster.canCureDisease(this.pandemik.currentPlayer, this._city, c));
            }
            this.canFlyTo.set(this.gameMaster.canFlyTo(this.pandemik.currentPlayer, this._city));
            this.canCharterFlyTo.set(this.gameMaster.canCharterFlyTo(this.pandemik.currentPlayer, this._city));
            this.canBuildResearchStation.set(this.gameMaster.canBuildStation(this.pandemik.currentPlayer, this._city));
            for (const player of this.gameMaster.pandemik.players) {
                if (player !== this.pandemik.currentPlayer) {
                    this.canGiveCard[player.index].set(this.gameMaster.canGiveCard(this.pandemik.currentPlayer, player, this._city));
                    this.canTakeCard[player.index].set(this.gameMaster.canTakeCard(this.pandemik.currentPlayer, player, this._city));
                }
                else {
                    this.canGiveCard[player.index].set(CanDoStatus.NO_AND_FUCK_YOU);
                    this.canTakeCard[player.index].set(CanDoStatus.NO_AND_FUCK_YOU);
                }
            }
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
            await this.gameMaster.doMove(this.pandemik.currentPlayer!, this._city);
        }
        this.update();
    }

    async onFly(): Promise<void> {
        //this.shown.set(false);
        if (this._city) {
            await this.gameMaster.doFly(this.pandemik.currentPlayer!, this._city);
        }
        this.update();
    }

    async onCharterFly(): Promise<void> {
        //this.shown.set(false);
        if (this._city) {
            await this.gameMaster.doCharterFly(this.pandemik.currentPlayer!, this._city);
        }
        this.update();
    }

    async onCureDisease(diseaseColor: GameColor): Promise<void> {
        //this.shown.set(false);
        if (this._city) {
            await this.gameMaster.doCureDisease(this.pandemik.currentPlayer!, this._city, diseaseColor);
        }
        this.update();
    }

    async onBuildResearchStation(): Promise<void> {
        //this.shown.set(false);
        if (this._city) {
            await this.gameMaster.doBuildStation(this.pandemik.currentPlayer!, this._city);
        }
        this.update();
    }

    async onGiveCard(playerIndex: number): Promise<void> {
        if (this._city) {
            await this.gameMaster.doGiveCard(this.pandemik.currentPlayer!, this.pandemik.players[playerIndex], this._city);
        }
        this.update();
    }
    
    async onTakeCard(playerIndex: number): Promise<void> {
        if (this._city) {
            await this.gameMaster.doTakeCard(this.pandemik.currentPlayer!, this.pandemik.players[playerIndex], this._city);
        }
        this.update();
    }
}