import { signal } from "@angular/core";
import { GameColor, CityDataById } from "../data";
import { Card } from "./deck";

export class PlayerCard extends Card {

    public color: GameColor | null = null;
    public img = signal<string>("");
    
    constructor(name: string, color: GameColor | null = null) {
        super(name);
        this.color = color;
    }
}

export class CityCard extends PlayerCard {

    public static Instances: CityCard[] = [];

    constructor(public cityId: string) {
        super(CityDataById(cityId).name, CityDataById(cityId).color);
        this.img.set(CityDataById(cityId).img ?? "");
        CityCard.Instances.push(this);
    }

    public redrawImg(): void {
        this.img.set(CityDataById(this.cityId).img ?? "");
    }
}

export class ResearchJokerCard extends PlayerCard {

    constructor() {
        super("Research Paper", GameColor.Joker);
    }
}

export class AirplaneCard extends PlayerCard {

    constructor() {
        super("Airplane", GameColor.Amber);
    }
}

export class TaskForceCard extends PlayerCard {

    constructor() {
        super("Task Force", GameColor.Amber);
    }
}