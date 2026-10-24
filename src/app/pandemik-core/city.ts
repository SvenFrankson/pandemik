import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import type { CityID } from "./data";
import { Quaternion } from "@babylonjs/core/Maths/math.vector.pure";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.pure";
import type { Scene } from "@babylonjs/core/scene";
import type { Nullable } from "@babylonjs/core/types";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { PandemikMap } from "./pandemik-map";
import { CreateSphereVertexData } from "@babylonjs/core/Meshes/Builders/sphereBuilder.pure";
import { QuickMaterial } from "./tools";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { CreateBeveledCylinderVertexData, CreateTrailVertexData } from "babylonjs-tiaratumgames-tools";
import { CityColor, GreyColor } from "./constants";

export class CityLink extends Mesh {

    public get map(): PandemikMap {
        return this.cityA.map;
    }

    constructor(public cityA: City, public cityB: City) {
        super(cityA.name + "-" + cityB.name, cityA.getScene());
        this.material = QuickMaterial(Color3.White());
    }

    public other(city: City): City | null {
        if (this.cityA === city) return this.cityB;
        if (this.cityB === city) return this.cityA;
        return null;
    }

    public updateMesh(): void {
        let p0 = this.cityA.position;
        let p1 = this.cityB.position;
        let line = [p0];
        for (let n = 1; n < 30; n++) {
            let f = n / 30;
            let pt = p0.scale(1 - f).addInPlace(p1.scale(f));
            this.map.projection.constraintHoveredRef(pt);

            line.push(pt);
        }
        line.push(p1);
        
        CreateTrailVertexData({ path: line, up: p0.add(p1).normalize(), radiusFunc: (t) => { return 0.07; } }).applyToMesh(this);
    }
}

export class City extends Mesh {

    public cityId: CityID;
    public lat: number = 0;
    public long: number = 0;
    public basePosition: Vector3 = new Vector3(0, 0, 0);
    public line: Nullable<Mesh> = null;

    public color: Color3;

    public links: CityLink[] = [];

    public static Connect(cityA: City, cityB: City): CityLink {
        let link = cityA.getLink(cityB);
        if (link) {
            return link;
        }
        link = new CityLink(cityA, cityB);
        cityA.links.push(link);
        cityB.links.push(link);

        console.log(`Created link between ${cityA.name} and ${cityB.name}`);
        
        return link;
    }

    constructor(public map: PandemikMap, cityId: CityID, name: string, scene: Nullable<Scene>) {
        super(name, scene);
        this.cityId = cityId;
        this.rotationQuaternion = Quaternion.Identity();
        this.color = CityColor;
        CreateBeveledCylinderVertexData({ radius: 0.25, height: 0.15 }).applyToMesh(this);
        this.material = QuickMaterial(this.color);
    }

    public updatePosition() {
        this.map.projection.projectToRef(this.lat, this.long, this.basePosition);
        let n = this.basePosition.clone().normalize().scaleInPlace(this.map.projection.hoverDistance);
        this.position.copyFrom(this.basePosition);
        
        this.map.projection.constraintHoveredRef(this.position, this.rotationQuaternion);

        this.updateLine();
    }

    public updateLine(): void {
        if (!this.line) {
            this.line = new Mesh("line", this.getScene());
            this.line.visibility = 1;
            this.line.material = this.material;
        }

        let p0 = this.basePosition;
        let p1 = this.position;
        let line = [p0];
        for (let n = 1; n < 10; n++) {
            let f = n / 10;
            let pt = p0.scale(1 - f).addInPlace(p1.scale(f));
            let pt0 = pt.clone();
            this.map.projection.constraintRef(pt0);
            let pt1 = pt.clone();
            this.map.projection.constraintHoveredRef(pt1);
            pt = pt0.scale(1 - f).addInPlace(pt1.scale(f));

            line.push(pt);
        }
        line.push(p1);
        
        CreateTrailVertexData({ path: line, up: p0, radiusFunc: (t) => { return 0.04 * t + 0.01; } }).applyToMesh(this.line);

        this.links.forEach(link => link.updateMesh());
    }

    public stepUpdate(): void {
        for (const otherCity of this.map.cities) {
            if (otherCity === this) continue;
            const distanceSquared = Vector3.DistanceSquared(this.position, otherCity.position);
            if (distanceSquared < this.map.projection.cityDistance * this.map.projection.cityDistance) {
                const direction = this.position.subtract(otherCity.position).normalize();
                const correction = (this.map.projection.cityDistance * this.map.projection.cityDistance - distanceSquared) / 2 / 20;
                this.position.addInPlace(direction.scale(correction));
                this.map.projection.constraintHoveredRef(this.position, this.rotationQuaternion);
                this.updateLine();

                otherCity.position.addInPlace(direction.scale(-correction));
                this.map.projection.constraintHoveredRef(otherCity.position, otherCity.rotationQuaternion);
                otherCity.updateLine();
            }
        }
    }

    public getLink(otherCity: City): CityLink | null {
        for (const link of this.links) {
            if (link.other(this) === otherCity) {
                return link;
            }
        }
        return null;
    }
}