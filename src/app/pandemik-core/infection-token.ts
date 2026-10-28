import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { City } from "./city";
import { MakeOutline } from "./tools";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { Board } from "./board";
import { GameColor } from "./data";
import { AnimationFactory, Easing } from "babylonjs-tiaratumgames-tools";
import { CityToken } from "./city-token";

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

        this.material = this.board.pandemik.sharedMaterials.plasticMaterials[this.diseaseColor];
        bottom.material = this.board.pandemik.sharedMaterials.darkFrameMaterial;
        pic.material = this.board.pandemik.sharedMaterials.infectionMaterials[this.diseaseColor];
    }
}