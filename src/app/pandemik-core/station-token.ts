import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { City } from "./city";
import { MakeOutline } from "./tools";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { Board } from "./board";
import { CityColor } from "./data";
import { AnimationFactory, Easing, GetGLTFMeshDataArray } from "babylonjs-tiaratumgames-tools";
import { CityToken } from "./city-token";

export class StationToken extends CityToken {

    constructor(city: City) {
        super(city);
        this.parent = city;
        this.size = 0;

        GetGLTFMeshDataArray("station.gltf", this.city.getScene()).then(data => {
            if (data) {
                data[1].vertexData.applyToMesh(this);
            }
        });
        
        MakeOutline(this, Color3.Black());
        this.material = this.board.pandemik.sharedMaterials.plasticMaterials[4];
    }
}