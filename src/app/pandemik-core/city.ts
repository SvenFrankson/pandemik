import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import type { Scene } from "@babylonjs/core/scene";
import type { Nullable } from "@babylonjs/core/types";
import { PandemikMap } from "./pandemik-map";
import { CreateSphereVertexData } from "@babylonjs/core/Meshes/Builders/sphereBuilder.pure";

export class City extends Mesh {

    public lat: number = 0;
    public long: number = 0;

    constructor(public map: PandemikMap, name: string, scene: Nullable<Scene>) {
        super(name, scene);
        CreateSphereVertexData({ diameter: 0.1 }).applyToMesh(this);
    }
}