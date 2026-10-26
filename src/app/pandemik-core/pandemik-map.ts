import { Vector3 } from '@babylonjs/core/Maths/math.vector.pure';
import type { Quaternion } from '@babylonjs/core/Maths/math.vector.pure';
import type { Nullable } from '@babylonjs/core/types';
import { City } from './city';
import { CityColor3s, CityID, CityLinks, MapData } from './data';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder.pure';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.pure';
import { Texture } from '@babylonjs/core/Materials/Textures/texture.pure';
import { GetGLTFMeshDataArray, IMeshData, QuaternionFromYZAxisToRef } from 'babylonjs-tiaratumgames-tools';
import { Axis } from '@babylonjs/core/Maths/math.axis';
import { BlackColor, LandColor, WaterColor } from './constants';
import { Mesh } from '@babylonjs/core/Meshes/mesh.pure';
import { Pandemik } from './pandemik';
import { QuickMaterial } from './tools';

export abstract class MapProjection {

    public cityDistance: number = 2.5;
    public hoverDistance: number = 0.5;

    public abstract projectToRef(lat: number, long: number, ref: Vector3): Vector3;

    public constraintRef(ref: Vector3, quat?: Nullable<Quaternion>): Vector3 {
        return ref;
    }

    public constraintHoveredRef(ref: Vector3, quat?: Nullable<Quaternion>): Vector3 {
        return ref;
    }
}

export class SphericalProjection extends MapProjection {

    public radius: number = 10;

    constructor(radius: number) {
        super();
        this.radius = radius;
    }

    public projectToRef(lat: number, long: number, ref: Vector3): Vector3 {
        const radius = this.radius;
        const latRad = lat * (Math.PI / 180);
        const longRad = long * (Math.PI / 180);
        ref.x = radius * Math.sin(longRad) * Math.cos(latRad);
        ref.y = radius * Math.sin(latRad);
        ref.z = - radius * Math.cos(longRad) * Math.cos(latRad);
        return ref;
    }

    public override constraintRef(ref: Vector3, quat?: Nullable<Quaternion>): Vector3 {
        const length = ref.length();
        if (length > 0) {
            ref.scaleInPlace(this.radius / length);
        }
        if (quat) {
            QuaternionFromYZAxisToRef(ref, Axis.Y, quat);
        }
        return ref;
    }

    public override constraintHoveredRef(ref: Vector3, quat?: Nullable<Quaternion>): Vector3 {
        const length = ref.length();
        if (length > 0) {
            ref.scaleInPlace((this.radius + this.hoverDistance) / length);
        }
        if (quat) {
            QuaternionFromYZAxisToRef(ref, Axis.Y, quat);
        }
        return ref;
    }
}

export class PandemikMap {

    public projection: MapProjection = new SphericalProjection(10);

    public base: Mesh;
    public cities: City[] = [];

    public tokenMeshData: IMeshData[] | null = null;
    public materials: StandardMaterial[] = [];

    constructor(public pandemik: Pandemik) {
        let zero = MeshBuilder.CreateSphere("base", { diameter: 0.2 });
        zero.position.z = - 1;
        this.projection.constraintRef(zero.position);
    
        this.base = MeshBuilder.CreateSphere("base", { diameter: 20 });
        this.base.rotation.y = Math.PI / 2;
        this.base.rotation.z = Math.PI;

        let baseMaterial = new StandardMaterial("base-material");
        let imgElement = document.createElement("img");
        imgElement.src = "image-4.png";
        imgElement.onload = () => {
            let canvas = document.createElement("canvas");
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;
            let ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(imgElement, 0, 0);
                let pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                for (let n = 0; n < pixelData.data.length; n+=4) {
                    let r = pixelData.data[n];
                    let g = pixelData.data[n+1];
                    let b = pixelData.data[n+2];
                    if (g === 255 && r === 0 && b === 0) {
                        pixelData.data[n] = WaterColor.r * 255;
                        pixelData.data[n+1] = WaterColor.g * 255;
                        pixelData.data[n+2] = WaterColor.b * 255;
                    }
                    else if (b === 255 && r === 0 && g === 0) {
                        pixelData.data[n] = BlackColor.r * 255;
                        pixelData.data[n+1] = BlackColor.g * 255;
                        pixelData.data[n+2] = BlackColor.b * 255;
                    }
                }
                ctx.putImageData(pixelData, 0, 0);
            }
            baseMaterial.diffuseTexture = new Texture(canvas.toDataURL(), null, false, true);
        };
        baseMaterial.specularColor.copyFromFloats(0, 0, 0);
        baseMaterial.diffuseColor.copyFromFloats(1, 0, 0);
        baseMaterial.emissiveColor.copyFromFloats(0, 0, 0);
        this.base.material = baseMaterial;
    }

    public async instantiate(): Promise<void> {
        this.tokenMeshData = await GetGLTFMeshDataArray("token.gltf", this.pandemik.scene!);
        this.tokenMeshData?.sort((a, b) => a.name.localeCompare(b.name));

        this.materials = [];
        for (let n = 0; n < CityColor3s.length; n++) {
            let mat = QuickMaterial(CityColor3s[n]);
            this.materials.push(mat);
        }

        for (let cityId = 0; cityId < CityID.LAST; cityId++) {
            const cityData = MapData.cities[cityId];
            if (cityData) {
                const city = new City(this, cityId, cityData.color, cityData.name, null);
                city.lat = cityData.lat;
                city.long = cityData.long;
                this.cities.push(city);
            }
            else {
                console.warn(`City data not found for cityId: ${cityId}`);
            }
        }

        for (const link of CityLinks.links) {
            let city1 = this.cities.find(c => c.cityId === link.city1);
            let city2 = this.cities.find(c => c.cityId === link.city2);
            if (city1 && city2) {
                City.Connect(city1, city2);
            }
            else {
                console.warn(`City link not found: ${link.city1} - ${link.city2}`);
            }
        }

        for (const city of this.cities) {
            city.updatePosition();
        }
    }

    private cityIndex: number = 0;
    private stability: number = 0;
    private smoothness: number = 100;
    private stabilized: boolean = false;
    public update(): void {
        if (!this.stabilized) {
            this.stability *= 0.5;
            for (let n = 0; n < this.cities.length; n++) {
                this.stability += this.cities[n].stepUpdate(100);
            }
            this.smoothness = Math.max(4, this.smoothness - 1);
            if (this.stability < 0.001) {
                this.stabilized = true;
                (this.base.material as StandardMaterial).diffuseColor.copyFromFloats(1, 1, 1);
                for (let n = 0; n < this.cities.length; n++) {
                    this.cities[n].updateLine();
                }
            }
        }
        for (let n = 0; n < this.cities.length; n++) {
            this.cities[n].update();
        }
    }
}