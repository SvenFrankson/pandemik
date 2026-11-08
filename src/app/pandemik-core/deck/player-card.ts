import { signal } from "@angular/core";
import { GameColor, CityDataById } from "../data";
import { Card } from "./deck";

export class PlayerCard extends Card {

    public color: GameColor | null = null;
    public img = signal<string>("");
    public icon = signal<string>("");
    
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

export class JokerCard extends PlayerCard {

    constructor(name: string, color: GameColor) {
        super(name, color);
    }
}

export class ResearchJokerCard extends JokerCard {

    constructor() {
        super("Research Paper", GameColor.Joker);
        this.icon.set("file-earmark-medical");
    }
}

export class AirplaneCard extends JokerCard {

    constructor() {
        super("Airplane", GameColor.Joker);
        this.icon.set("airplane");
    }
}

export class TaskForceCard extends JokerCard {

    constructor() {
        super("Task Force", GameColor.Joker);
        this.icon.set("bandaid");
    }
}

export class ResearchCenterCard extends JokerCard {

    constructor() {
        super("Research Center", GameColor.Joker);
        this.icon.set("hospital");
    }
}