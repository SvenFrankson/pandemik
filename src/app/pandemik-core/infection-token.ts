import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { City } from "./city";
import { MakeOutline } from "./tools";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { Board } from "./board";
import { GameColor } from "./data";
import { AnimationFactory, Easing, EvaluatePathToRef, QuaternionFromYZAxisToRef } from "babylonjs-tiaratumgames-tools";
import { CityToken } from "./city-token";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { Axis, Quaternion } from "@babylonjs/core";

export class InfectionToken extends CityToken {

    constructor(city: City, public diseaseColor: GameColor) {
        super(city);
        this.parent = city;
        this.size = 0;

        MakeOutline(this, Color3.White());
        this.board.tokenMeshData[7]?.vertexData.applyToMesh(this);

        let bottom = new Mesh("pic", this.getScene());
        this.board.tokenMeshData[8]?.vertexData.applyToMesh(bottom);
        bottom.parent = this;

        let pic = new Mesh("pic", this.getScene());
        this.board.tokenMeshData[9]?.vertexData.applyToMesh(pic);
        pic.parent = this;

        this.material = this.board.pandemik.sharedMaterials.redPlasticMaterial;
        bottom.material = this.board.pandemik.sharedMaterials.darkFrameMaterial;
        pic.material = this.board.pandemik.sharedMaterials.infectionMaterials[this.diseaseColor];
    }

    public async popAndVanish(size: number, duration: number = 1, fPeak: number = 0.5): Promise<void> {
        await this.animateSize(size, duration * fPeak, Easing.easeOutCubic);
        await this.animateSize(0, duration * (1 - fPeak), Easing.easeInCubic);
    }

    public async followPath(path: Vector3[], duration: number = 1, easing?: (f: number) => number, onUpdate?: (rawF: number) => void): Promise<void> {
        if (!this.rotationQuaternion) {
            this.rotationQuaternion = Quaternion.Identity();
        }
        return new Promise<void>(resolve => {
            let t0 = performance.now() / 1000;
            let step = () => {
                let t = performance.now() / 1000;
                let rawF = (t - t0) / duration;
                if (rawF < 1) {
                    let f = rawF;
                    if (easing) {
                        f = easing(rawF);
                    }
                    EvaluatePathToRef(f, path, this.position);
                    QuaternionFromYZAxisToRef(this.position, Axis.Y, this.rotationQuaternion!)
                    if (onUpdate) {
                        onUpdate(rawF);
                    }
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
}