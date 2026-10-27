import { signal } from "@angular/core";
import { City } from "../city";
import { Pandemik } from "../pandemik";
import { GameColor } from "../data";
import { GameMaster } from "../game-master";

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

    shown = signal<boolean>(false);
    canGoTo = signal<boolean>(false);
    goToCost = signal<number>(1);
    canFlyTo = signal<boolean>(false);
    canCureDisease = [signal<boolean>(false), signal<boolean>(false), signal<boolean>(false), signal<boolean>(false)];
    canBuildResearchStation = signal<boolean>(false);
    screenX = signal<number>(0);
    screenY = signal<number>(0);

    constructor(public pandemik: Pandemik) {
        
    }

    update(): void {
        if (this._city != null && this.pandemik.currentPlayer) {
            this.shown.set(true);

            this.screenX.set(this._city.screenEastX());
            this.screenY.set(this._city.screenEastY());
            this.screenX = this._city.screenEastX;
            this.screenY = this._city.screenEastY;

            this.canGoTo.set(this.gameMaster.canMoveTo(this.pandemik.currentPlayer, this._city));
            this.goToCost.set(this.gameMaster.moveToCost(this.pandemik.currentPlayer, this._city));
            this.canCureDisease[GameColor.Blue].set(this.gameMaster.canCureDisease(this.pandemik.currentPlayer, this._city, GameColor.Blue));
            this.canCureDisease[GameColor.Yellow].set(this.gameMaster.canCureDisease(this.pandemik.currentPlayer, this._city, GameColor.Yellow));
            this.canCureDisease[GameColor.Black].set(this.gameMaster.canCureDisease(this.pandemik.currentPlayer, this._city, GameColor.Black));
            this.canCureDisease[GameColor.Green].set(this.gameMaster.canCureDisease(this.pandemik.currentPlayer, this._city, GameColor.Green));
            this.canBuildResearchStation.set(this.gameMaster.canBuildStation(this.pandemik.currentPlayer, this._city));
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
}