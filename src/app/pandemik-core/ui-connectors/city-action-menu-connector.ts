import { signal } from "@angular/core";
import { City } from "../city";
import { Pandemik } from "../pandemik";
import { CityColor } from "../data";
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

            this.screenX.set(0);
            this.screenY.set(0);
            this.screenX = this._city.screenEastX;
            this.screenY = this._city.screenEastY;

            this.canGoTo.set(this.gameMaster.canMoveTo(this.pandemik.currentPlayer, this._city));
            this.canCureDisease[CityColor.Blue].set(this.gameMaster.canCureDisease(this.pandemik.currentPlayer, this._city, CityColor.Blue));
            this.canCureDisease[CityColor.Yellow].set(this.gameMaster.canCureDisease(this.pandemik.currentPlayer, this._city, CityColor.Yellow));
            this.canCureDisease[CityColor.Black].set(this.gameMaster.canCureDisease(this.pandemik.currentPlayer, this._city, CityColor.Black));
            this.canCureDisease[CityColor.Green].set(this.gameMaster.canCureDisease(this.pandemik.currentPlayer, this._city, CityColor.Green));
        }
        else {
            this.shown.set(false);
            this.screenX.set(0);
            this.screenY.set(0);
        }
    }

    onGoTo(): void {
        this.shown.set(false);
        if (this._city) {
            this.gameMaster.doMove(this.pandemik.currentPlayer!, this._city);
        }
    }

    onCureDisease(diseaseColor: CityColor): void {
        this.shown.set(false);
        if (this._city) {
            this.gameMaster.doCureDisease(this.pandemik.currentPlayer!, this._city, diseaseColor);
        }
    }
}