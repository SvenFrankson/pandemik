import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.pure";
import { Axis } from "@babylonjs/core/Maths/math.axis";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { Scene } from "@babylonjs/core/scene.pure";
import { Angle, AngleFromToAround, AnimationFactory, Easing, LerpAngle } from "babylonjs-tiaratumgames-tools";

interface ISceneObject {
    getScene: () => Scene;
}

function PDMKCreateNumbers(
    owner: ISceneObject,
    obj: any,
    properties: string[],
    onUpdateCallback?: (f?: number) => void,
    isAngle?: boolean[],
    easing?: (v: number) => number
): (targets: number[], duration: number) => Promise<void> {
    return (targets: number[], duration: number) => {
        return new Promise<void>(resolve => {
            let n = properties.length;
            let origins: number[] = [];
            for (let i = 0; i < n; i++) {
                origins[i] = obj[properties[i]];
            }
            let t0 = performance.now();
            if ((owner as any)[properties[0] + "_animation"]) {
                owner.getScene().onBeforeRenderObservable.removeCallback((owner as any)[properties[0] + "_animation"]);
            }
            let animationCB = () => {
                let f = (performance.now() - t0) / 1000 / duration;
                if (f < 1) {
                    if (easing) {
                        f = easing(f);
                    }
                    for (let i = 0; i < n; i++) {
                        if (isAngle && isAngle[i]) {
                            obj[properties[i]] = LerpAngle(origins[i], targets[i], f);
                        }
                        else {
                            obj[properties[i]] = origins[i] * (1 - f) + targets[i] * f;
                        }
                    }
                    if (onUpdateCallback) {
                        onUpdateCallback(f);
                    }
                }
                else {
                    for (let i = 0; i < n; i++) {
                        obj[properties[i]] = targets[i];
                    }
                    if (onUpdateCallback) {
                        onUpdateCallback(1);
                    }
                    owner.getScene().onBeforeRenderObservable.removeCallback(animationCB);
                    (owner as any)[properties[0] + "_animation"] = undefined;
                    resolve();
                }
            }
            owner.getScene().onBeforeRenderObservable.add(animationCB);
            (owner as any)[properties[0] + "_animation"] = animationCB;
        })
    }
}

function XTremeEasing(f: number): number {
    return Easing.easeOutCubic(Easing.easeOutCubic(f));
}

export class GameCamera extends ArcRotateCamera {

    public animateAlphaBeta = AnimationFactory.EmptyNumbersCallback;

    constructor(radius: number, target: Vector3, scene: any) {
        super("gameCamera", - Math.PI / 2, Math.PI / 3, radius, target, scene);
        this.animateAlphaBeta = PDMKCreateNumbers(this, this, ["alpha", "beta"], this._radiusUpdate, [true, true], XTremeEasing);
    }

    private _height: number = 0;
    private _radiusOrigin: number = 20;
    private _radiusDestination: number = 20;
    private _radiusUpdate = (f: number | undefined) => {
        if (f === undefined) return;
        let h = Math.sin(f * Math.PI) * this._height;
        this.radius = this._radiusOrigin + (this._radiusDestination - this._radiusOrigin) * f + h;
    }

    public async goTo(target: Vector3, duration: number = 1, radius?: number, height: number = 0): Promise<void> {
        const alpha = - AngleFromToAround(Axis.X, target, Axis.Y);
        const beta = Angle(Axis.Y, target);

        this._radiusOrigin = this.radius;
        this._radiusDestination = this.radius;
        this._height = height;
        if (radius !== undefined && isFinite(radius)) {
            this._radiusDestination = radius;
        }

        this.animateAlphaBeta([alpha, beta], 3 * duration);
        await new Promise(resolve => setTimeout(resolve, duration * 1000));
    }
}

