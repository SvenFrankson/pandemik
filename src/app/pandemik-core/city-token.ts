import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { City } from "./city";
import { MakeOutline } from "./tools";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { Board } from "./board";
import { CityColor } from "./data";
import { AnimationFactory, Easing } from "babylonjs-tiaratumgames-tools";

export class CityToken extends Mesh {

    public get size(): number {
        return this.scaling.x;
    }
    public set size(value: number) {
        this.scaling.copyFromFloats(value, value, value);
    }

    public get map(): Board {
        return this.city.map;
    }

    public animatePosition = AnimationFactory.EmptyVector3Callback;
    public animateSize = AnimationFactory.EmptyNumberCallback;

    constructor(public city: City) {
        super("infection-token", city.getScene());
        this.parent = city;

        this.animatePosition = AnimationFactory.CreateVector3(this, this, "position");
        this.animateSize = AnimationFactory.CreateNumber(this, this, "size");
    }
}