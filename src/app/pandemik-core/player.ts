import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import type { Pandemik } from "./pandemik";
import { AnimationFactory, CreateBeveledBoxVertexData } from "babylonjs-tiaratumgames-tools";
import type { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { City } from "./city";

export class Player extends Mesh {

    public currentCity: City;
    public animatePosition = AnimationFactory.EmptyVector3Callback;

    constructor(public pandemik: Pandemik, city: City) {
        super("player", pandemik.scene);
        this.currentCity = city;
        this.position.copyFrom(city.position);

        CreateBeveledBoxVertexData({ size: 0.5 }).applyToMesh(this);
        this.animatePosition = AnimationFactory.CreateVector3(this, this, "position");
    }

    public async goTo(city: City, duration: number = 1): Promise<void> {
        this.currentCity = city;
        await this.animatePosition(city.position, duration);
    }
}