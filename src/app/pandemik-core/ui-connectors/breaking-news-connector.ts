import { signal } from "@angular/core";
import { City } from "../city";
import { Pandemik } from "../pandemik";
import { CityColor } from "../data";
import { GameMaster } from "../game-master";

export class BreakingInfo {

    text: string = "";

    constructor(text: string) {
        this.text = text;
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
        this.breakingNews.update((current) => [...current, info]);
    }
}