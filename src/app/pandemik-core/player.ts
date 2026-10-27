import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { Quaternion } from "@babylonjs/core/Maths/math.vector.pure";
import { Axis } from "@babylonjs/core/Maths/math.axis";
import type { Pandemik } from "./pandemik";
import { AnimationFactory, CreateBeveledBoxVertexData, EvaluatePathToRef, GetGLTFMeshDataArray, QuaternionFromYZAxisToRef } from "babylonjs-tiaratumgames-tools";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { City } from "./city";
import { MakeOutline } from "./tools";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { signal } from "@angular/core";

export class Player extends Mesh {

    public currentCity: City;
    public availableAPs = signal<number>(4);
    public animatePosition = AnimationFactory.EmptyVector3Callback;

    constructor(public pandemik: Pandemik, city: City) {
        super("player", pandemik.scene);
        this.currentCity = city;
        this.position.copyFrom(city.playerAnchor.absolutePosition);
        this.rotationQuaternion = Quaternion.Identity(); 
        QuaternionFromYZAxisToRef(this.position, Axis.Y, this.rotationQuaternion!)
        this.scaling.copyFromFloats(0.35, 0.35, 0.35);

        GetGLTFMeshDataArray("pion.gltf", pandemik.scene!).then(data => {
            if (data) {
                data[1].vertexData.applyToMesh(this);
                MakeOutline(this, Color3.Black());
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
            await this.animatePosition(city.playerAnchor.absolutePosition, duration);
        }
        else {
            let path = link.path;
            if (this.currentCity === link.cityB) {
                path = path.slice().reverse();
            }
            this.currentCity = city;
            link.highlight();
            await this.animatePosition(path[0], duration / 8);
            await this.followPath(path, 6 * duration / 8);
            let destination = city.playerAnchor.absolutePosition;
            if (passOver) {
                destination = city.absolutePosition;
            }
            await this.animatePosition(destination, duration / 8);
            link.unlit();
        }
    }

    public consumeAP(amount: number = 1): void {
        this.availableAPs.set(this.availableAPs() - amount);
    }

    public setAvailableAPs(amount: number): void {
        this.availableAPs.set(amount);
    }
}