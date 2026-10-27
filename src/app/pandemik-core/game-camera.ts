import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.pure";
import { Axis } from "@babylonjs/core/Maths/math.axis";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { Angle, AngleFromToAround, AnimationFactory, Easing } from "babylonjs-tiaratumgames-tools";

export class GameCamera extends ArcRotateCamera {

    public animateAlphaBeta = AnimationFactory.EmptyNumbersCallback;
    public animateRadius = AnimationFactory.EmptyNumberCallback;

    constructor(radius: number, target: Vector3, scene: any) {
        super("gameCamera", - Math.PI / 2, Math.PI / 3, radius, target, scene);
        this.animateAlphaBeta = AnimationFactory.CreateNumbers(this, this, ["alpha", "beta"], undefined, [true, true], Easing.easeOutCubic);
        this.animateRadius = AnimationFactory.CreateNumber(this, this, "radius");
    }

    public async goTo(target: Vector3, radius?: number, height: number = 0): Promise<void> {
        const alpha = - AngleFromToAround(Axis.X, target, Axis.Y);
        const beta = Angle(Axis.Y, target);

        if (radius !== undefined && isFinite(radius)) {
            const rMax = Math.max(this.radius, radius) + height;
            this.animateRadius(rMax, 0.5, Easing.easeInOutSine).then(() => this.animateRadius(radius, 0.5, Easing.easeInOutSine));
        }

        await this.animateAlphaBeta([alpha, beta], 1);
    }
}

