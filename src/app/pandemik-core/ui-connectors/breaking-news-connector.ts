import { signal } from "@angular/core";
import { City } from "../city";
import { Pandemik } from "../pandemik";
import { GameColor } from "../data";
import { GameMaster } from "../game-master";

export class BreakingInfo {

    city?: City;
    text: string = "";
    severity: number = 0;

    constructor(text: string, city?: City, severity: number = 0) {
        this.city = city;
        this.text = text;
        this.severity = severity;
    }
}

export class BreakingNewsConnector {

    breakingNews = signal<BreakingInfo[]>([]);

    public get gameMaster(): GameMaster {
        return this.pandemik.gameMaster;
    }

    constructor(public pandemik: Pandemik) {
        
    }

    addBreakingInfo(info: BreakingInfo): void {
        this.breakingNews.update((current) => [...current, info].slice(-16));
    }
}