import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import type { Material } from "@babylonjs/core/Materials/material";
import { Quaternion } from "@babylonjs/core/Maths/math.vector.pure";
import { Axis } from "@babylonjs/core/Maths/math.axis";
import type { Pandemik } from "./pandemik";
import { AnimationFactory, CreateBeveledBoxVertexData, EvaluatePathToRef, GetGLTFMeshDataArray, QuaternionFromYZAxisToRef } from "babylonjs-tiaratumgames-tools";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { City, PlayerAnchor } from "./city";
import { MakeOutline, QuickMaterial } from "./tools";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { signal } from "@angular/core";
import { PlayerCard } from "./deck/player-card";
import { TimeFactor } from "./constants";

export class Player extends Mesh {

    public get index(): number {
        return this.pandemik.players.indexOf(this);
    }
    public currentCity: City;
    public availableAPs = signal<number>(0);
    public apPerTurn: number = 5;
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

    public base: Mesh;
    public head: Mesh;
    public apMeshes: Mesh[] = [];
    public setMaterial(material: Material): void {
        this.material = material;
        this.base.material = material;
        this.head.material = material;
        for (let apMesh of this.apMeshes) {
            apMesh.material = material;
        }
    }

    constructor(name: string, apPerTurn: number, public pandemik: Pandemik, city: City) {
        super(name, pandemik.scene);
        this.currentCity = city;
        let playerAnchor = city.getFirstFreePlayerAnchor();
        this._anchor = playerAnchor;
        this.anchor = playerAnchor;
        this.position.copyFrom(playerAnchor.absolutePosition);
        this.rotationQuaternion = Quaternion.Identity(); 
        QuaternionFromYZAxisToRef(this.position, Axis.Y, this.rotationQuaternion!)
        this.scaling.copyFromFloats(0.4, 0.4, 0.4);
        this.apPerTurn = apPerTurn;

        this.base = new Mesh("base", pandemik.scene);
        this.base.rotation.x = Math.PI / 10;
        this.base.parent = this;

        this.head = new Mesh("head", pandemik.scene);
        this.head.parent = this.base;

        this.apMeshes = [];
        for (let i = 0; i < this.apPerTurn; i++) {
            let apMesh = new Mesh("apMesh" + i, pandemik.scene);
            apMesh.rotation.y = (this.apPerTurn - 1) / 2 * Math.PI / 5 - i * Math.PI / 5;
            apMesh.parent = this.base;
            apMesh.material = this.material;
            this.apMeshes.push(apMesh);
        }

        GetGLTFMeshDataArray("pion.gltf", pandemik.scene!).then(data => {
            if (data) {
                data[1].vertexData.applyToMesh(this.base);
                data[2].vertexData.applyToMesh(this.head);
                for (let i = 0; i < this.apMeshes.length; i++) {
                    data[3].vertexData.applyToMesh(this.apMeshes[i]);
                }
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
        for (let n = 0; n < this.apMeshes.length; n++) {
            if (n < this.availableAPs()) {
                this.apMeshes[n].material = this.pandemik.sharedMaterials.apMaterial;
            }
            else {
                this.apMeshes[n].material = this.material;
            }
        }
    }

    public setAvailableAPs(amount: number): void {
        this.availableAPs.set(amount);
        for (let n = 0; n < this.apMeshes.length; n++) {
            if (n < this.availableAPs()) {
                this.apMeshes[n].material = this.pandemik.sharedMaterials.apMaterial;
            }
            else {
                this.apMeshes[n].material = this.material;
            }
        }
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
        super("Contingency Planner", 5, pandemik, city);
        this.color = "#21ddd4";
        this.material = QuickMaterial(Color3.FromHexString(this.color));
        this.head.material = this.material;
        MakeOutline(this.base, Color3.Black());
        MakeOutline(this.head, Color3.Black());
    }
}

export class Dispatcher extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Dispatcher", 5, pandemik, city);
        this.color = "#dd21be";
        this.setMaterial(QuickMaterial(Color3.FromHexString(this.color)));
        MakeOutline(this.base, Color3.Black());
        MakeOutline(this.head, Color3.Black());
    }
}

export class Medic extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Medic", 4, pandemik, city);
        this.color = "#dd6621";
        this.setMaterial(QuickMaterial(Color3.FromHexString(this.color)));
        MakeOutline(this.base, Color3.Black());
        MakeOutline(this.head, Color3.Black());
    }
}

export class OperationsExpert extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Operations Expert", 5, pandemik, city);
        this.color = "#21dd40";
        this.setMaterial(QuickMaterial(Color3.FromHexString(this.color)));
        MakeOutline(this.base, Color3.Black());
        MakeOutline(this.head, Color3.Black());
    }
}

export class QuarantineSpecialist extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Quarantine Specialist", 5, pandemik, city);
        this.color = "#3421dd";
        this.setMaterial(QuickMaterial(Color3.FromHexString(this.color)));
        MakeOutline(this.base, Color3.Black());
        MakeOutline(this.head, Color3.Black());
    }
}

export class Researcher extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Researcher", 5, pandemik, city);
        this.color = "#ddb121";
        this.setMaterial(QuickMaterial(Color3.FromHexString(this.color)));
        MakeOutline(this.base, Color3.Black());
        MakeOutline(this.head, Color3.Black());
    }
}

export class Scientist extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Scientist", 4, pandemik, city);
        this.color = "#d3f1ff";
        this.setMaterial(QuickMaterial(Color3.FromHexString(this.color)));
        MakeOutline(this.base, Color3.Black());
        MakeOutline(this.head, Color3.Black());
    }
}

export class Civilian extends Player {

    constructor(pandemik: Pandemik, city: City) {
        super("Civilian", 5, pandemik, city);
        this.color = "#31395e";
        this.setMaterial(QuickMaterial(Color3.FromHexString(this.color)));
        MakeOutline(this.base, Color3.White());
        MakeOutline(this.head, Color3.White());
    }
}

export function RandomAvailableRole(pandemik: Pandemik) {
    let roles = [ContingencyPlanner, Dispatcher, Medic, OperationsExpert, QuarantineSpecialist, Researcher, Scientist];
    roles = [Medic, Scientist, Civilian];
    for (const player of pandemik.players) {
        roles = roles.filter(role => !(player instanceof role));
    }
    if (roles.length > 0) {
        return roles[Math.floor(Math.random() * roles.length)];
    }
    return Civilian;
}