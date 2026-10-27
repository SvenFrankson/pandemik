import { signal } from "@angular/core";
import { City } from "../city";

export class CityActionMenuConnector {

    private _city: City | null = null;
    public get city(): City | null {
        return this._city;
    }
    public set city(city: City | null) {
        this._city = city;
        this.shown.set(city != null);
        if (city) {
            this.screenX = city.screenEastX;
            this.screenY = city.screenEastY;
        } else {
            this.screenX.set(0);
            this.screenY.set(0);
        }
    }

    shown = signal<boolean>(false);
    canGoTo = signal<boolean>(true);
    canFlyTo = signal<boolean>(true);
    canCureDisease = signal<boolean>(true);
    screenX = signal<number>(0);
    screenY = signal<number>(0);
}