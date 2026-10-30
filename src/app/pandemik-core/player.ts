import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { Quaternion } from "@babylonjs/core/Maths/math.vector.pure";
import { Axis } from "@babylonjs/core/Maths/math.axis";
import type { Pandemik } from "./pandemik";
import { AnimationFactory, CreateBeveledBoxVertexData, EvaluatePathToRef, GetGLTFMeshDataArray, QuaternionFromYZAxisToRef } from "babylonjs-tiaratumgames-tools";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { City, PlayerAnchor } from "./city";
import { MakeOutline, QuickMaterial } from "./tools";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { signal } from "@angular/core";
import { PlayerCard } from "./deck/deck";
import { TimeFactor } from "./constants";

export class Player extends Mesh {

    public get index(): number {
        return this.pandemik.players.indexOf(this);
    }
    public currentCity: City;
    public availableAPs = signal<number>(0);
    public playerCards = signal<PlayerCard[]>([]); 
    public color: string = "#000000";

    public animatePosition = AnimationFactory.EmptyVector3Callback;
    private _anchor: PlayerAnchor;
    public get anchor(): PlayerAnchor {
        return this._anchor;
    }
    public set anchor(value: PlayerAnchor) {
        if (this._anchor) {
            this._anchor.release();
        }
        this._anchor = value;
        if (this._anchor) {
            this._anchor.take(this);
        }
    }

    constructor(name: string,public pandemik: Pandemik, city: City) {
        super(name, pandemik.scene);
        this.currentCity = city;
        let playerAnchor = city.getFirstFreePlayerAnchor();
        this._anchor = playerAnchor;
        this.anchor = playerAnchor;
        this.position.copyFrom(playerAnchor.absolutePosition);
        this.rotationQuaternion = Quaternion.Identity(); 
        QuaternionFromYZAxisToRef(this.position, Axis.Y, this.rotationQuaternion!)
        this.scaling.copyFromFloats(0.35, 0.35, 0.35);

        GetGLTFMeshDataArray("pion.gltf", pandemik.scene!).then(data => {
            if (data) {
                data[1].vertexData.applyToMesh(this);
            }
        });
        this.animatePosition = AnimationFactory.CreateVector3(
            this,
            this,
            "position",
            () => {
                QuaternionFromYZAxisToRef(this.position, Axis.Y, this.rotationQuaternion!);
            }
        );
    }

    public async followPath(path: Vector3[], duration: number = 1): Promise<void> {
        return new Promise<void>(resolve => {
            let t0 = performance.now() / 1000;
            let step = () => {
                let t = performance.now() / 1000;
                let f = (t - t0) / duration;
                if (f < 1) {
                    EvaluatePathToRef(f, path, this.position);
                    QuaternionFromYZAxisToRef(this.position, Axis.Y, this.rotationQuaternion!)
                    requestAnimationFrame(step);
                }
                else {
                    this.position.copyFrom(path[path.length - 1]);
                    QuaternionFromYZAxisToRef(this.position, Axis.Y, this.rotationQuaternion!)
                    resolve();
                }
            }
            step();
        });
    }

    public async goTo(city: City, duration: number = 1, passOver: boolean = false): Promise<void> {
        const link = this.currentCity.getLink(city);
        if (!link) {
            this.currentCity = city;
            let playerAnchor = city.getFirstFreePlayerAnchor();
            this.anchor = playerAnchor;
            await this.animatePosition(playerAnchor.absolutePosition, duration * TimeFactor);
        }
        else {
            let path = link.path;
            if (this.currentCity === link.cityB) {
                path = path.slice().reverse();
            }
            this.currentCity = city;
            link.highlight();
            await this.animatePosition(path[0], duration / 8 * TimeFactor);
            await this.followPath(path, 6 * duration / 8 * TimeFactor);
            let playerAnchor = city.getFirstFreePlayerAnchor();
            this.anchor = playerAnchor;
            let destination = playerAnchor.absolutePosition;
            if (passOver) {
                destination = city.absolutePosition;
            }
            await this.animatePosition(destination, duration / 8 * TimeFactor);
            link.unlit();
        }
    }

    public consumeAP(amount: number = 1): void {
        this.availableAPs.set(this.availableAPs() - amount);
    }

    public setAvailableAPs(amount: number): void {
        this.availableAPs.set(amount);
    }

    public addPlayerCard(card: PlayerCard): PlayerCard {
        this.playerCards.set([...this.playerCards(), card]);
        return card;
    }

    public removePlayerCard(card: PlayerCard): PlayerCard {
        this.playerCards.set(this.playerCards().filter(c => c !== card));
        return card;
    }
}

export class ContingencyPlanner extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Contingency Planner", pandemik, city);
        this.color = "#21ddd4";
        this.material = QuickMaterial(Color3.FromHexString(this.color));
        MakeOutline(this, Color3.Black());
    }
}

export class Dispatcher extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Dispatcher", pandemik, city);
        this.color = "#dd21be";
        this.material = QuickMaterial(Color3.FromHexString(this.color));
        MakeOutline(this, Color3.Black());
    }
}

export class Medic extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Medic", pandemik, city);
        this.color = "#dd6621";
        this.material = QuickMaterial(Color3.FromHexString(this.color));
        MakeOutline(this, Color3.Black());
    }
}

export class OperationsExpert extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Operations Expert", pandemik, city);
        this.color = "#21dd40";
        this.material = QuickMaterial(Color3.FromHexString(this.color));
        MakeOutline(this, Color3.Black());
    }
}

export class QuarantineSpecialist extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Quarantine Specialist", pandemik, city);
        this.color = "#3421dd";
        this.material = QuickMaterial(Color3.FromHexString(this.color));
        MakeOutline(this, Color3.Black());
    }
}

export class Researcher extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Researcher", pandemik, city);
        this.color = "#ddb121";
        this.material = QuickMaterial(Color3.FromHexString(this.color));
        MakeOutline(this, Color3.Black());
    }
}

export class Scientist extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Scientist", pandemik, city);
        this.color = "#d3f1ff";
        this.material = QuickMaterial(Color3.FromHexString(this.color));
        MakeOutline(this, Color3.Black());
    }
}

export class Civilian extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Civilian", pandemik, city);
        this.color = "#31395e";
        this.material = QuickMaterial(Color3.FromHexString(this.color));
        MakeOutline(this, Color3.Black());
    }
}

export function RandomAvailableRole(pandemik: Pandemik) {
    let roles = [ContingencyPlanner, Dispatcher, Medic, OperationsExpert, QuarantineSpecialist, Researcher, Scientist];
    for (const player of pandemik.players) {
        roles = roles.filter(role => !(player instanceof role));
    }
    if (roles.length > 0) {
        return roles[Math.floor(Math.random() * roles.length)];
    }
    return Civilian;
}