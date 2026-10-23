import { Vector3 } from '@babylonjs/core/Maths/math.vector.pure';
import { City } from './city';
import { MapData } from './data';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder.pure';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.pure';
import { Texture } from '@babylonjs/core/Materials/Textures/texture.pure';

export abstract class MapProjection {

    abstract projectToRef(lat: number, long: number, ref: Vector3): Vector3;
}

export class SphericalProjection extends MapProjection {

    projectToRef(lat: number, long: number, ref: Vector3): Vector3 {
        const radius = 2;
        const latRad = lat * (Math.PI / 180);
        const longRad = long * (Math.PI / 180);
        ref.x = radius * Math.sin(longRad) * Math.cos(latRad);
        ref.y = radius * Math.sin(latRad);
        ref.z = - radius * Math.cos(longRad) * Math.cos(latRad);
        return ref;
    }
}

export class PandemikMap {

    public projection: MapProjection = new SphericalProjection();
    public cities: City[] = [];

    constructor() {

        let zero = MeshBuilder.CreateSphere("base", { diameter: 0.2 });
        zero.position.z = -2;
    
        let base = MeshBuilder.CreateSphere("base", { diameter: 4 });
        base.rotation.y = Math.PI / 2;
        base.rotation.z = Math.PI;
        let baseMaterial = new StandardMaterial("base-material");
        baseMaterial.diffuseTexture = new Texture("image.png", null, false, true);
        base.material = baseMaterial;

        for (const cityData of MapData.cities) {
            const city = new City(this, cityData.name, null);
            city.lat = cityData.lat;
            city.long = cityData.long;
            this.projection.projectToRef(city.lat, city.long, city.position);
            this.cities.push(city);
        }
    }
}