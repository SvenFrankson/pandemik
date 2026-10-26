import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { CityColor3s, CityID, type CityColor } from "./data";
import { Matrix, Quaternion } from "@babylonjs/core/Maths/math.vector.pure";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.pure";
import type { Scene } from "@babylonjs/core/scene";
import type { Nullable } from "@babylonjs/core/types";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { Board } from "./board";
import { CreateSphereVertexData } from "@babylonjs/core/Meshes/Builders/sphereBuilder.pure";
import { MakeOrthogonal, MakeOrthogonalInPlace, MakeOutline, QuickMaterial } from "./tools";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { Angle, CreateBeveledBox, CreateBeveledCylinder, CreateBeveledCylinderVertexData, CreateTrailVertexData, CreateWireVertexData, Easing, GetGLTFMeshDataArray } from "babylonjs-tiaratumgames-tools";
import { RedColor, GreyColor } from "./constants";
import { signal } from "@angular/core";
import { Texture } from "@babylonjs/core/Materials/Textures/texture.pure";
import { InfectionToken } from "./infection-token";
import { CityToken } from "./city-token";

export class CityLink extends Mesh {

    public get map(): Board {
        return this.cityA.map;
    }

    constructor(public cityA: City, public cityB: City) {
        super(cityA.name + "-" + cityB.name, cityA.getScene());
        this.material = this.cityA.map.frameMaterial;
    }

    public other(city: City): City | null {
        if (this.cityA === city) return this.cityB;
        if (this.cityB === city) return this.cityA;
        return null;
    }

    public updateMesh(): void {
        let p0 = this.cityA.position.clone();
        let p1 = this.cityB.position.clone();
        let dir = p1.subtract(p0);

        let dir0 = MakeOrthogonal(dir, p0).normalize();
        p0.addInPlace(dir0.scale(this.cityA.radius * 0.95));

        let dir1 = MakeOrthogonal(dir, p1).normalize();
        p1.subtractInPlace(dir1.scale(this.cityB.radius * 0.95));

        let line = [p0];
        for (let n = 1; n < 30; n++) {
            let f = n / 30;
            let pt = p0.scale(1 - f).addInPlace(p1.scale(f));
            this.map.projection.constraintHoveredRef(pt);

            line.push(pt);
        }
        line.push(p1);
        
        CreateWireVertexData({ path: line, radiusFunc: (t) => { return 0.025; } }).applyToMesh(this);
    }
}

export class City extends Mesh {

    public radius: number = 0.5;

    public cityId: CityID;
    public lat: number = 0;
    public long: number = 0;
    public basePosition: Vector3 = new Vector3(0, 0, 0);

    public pin: Nullable<Mesh> = null;
    public frame: Nullable<Mesh> = null;
    public bottom: Nullable<Mesh> = null;
    public picture: Nullable<Mesh> = null;
    public line: Nullable<Mesh> = null;

    public cityColor: CityColor;
    public color: Color3;

    public links: CityLink[] = [];

    public infections = [
        signal<number>(0),
        signal<number>(0),
        signal<number>(0),
        signal<number>(0)
    ];
    public tokens: CityToken[] = [];
    
	public screenNorthX = signal<number>(0);
	public screenNorthY = signal<number>(0);
	public screenSouthX = signal<number>(0);
	public screenSouthY = signal<number>(0);
	public opacity = signal<number>(0);

    public static Connect(cityA: City, cityB: City): CityLink {
        let link = cityA.getLink(cityB);
        if (link) {
            return link;
        }
        link = new CityLink(cityA, cityB);
        cityA.links.push(link);
        cityB.links.push(link);
        
        return link;
    }

    constructor(public map: Board, cityId: CityID, cityColor: CityColor, name: string, scene: Nullable<Scene>) {
        super(name, scene);
        this.cityId = cityId;
        this.rotationQuaternion = Quaternion.Identity();
        this.cityColor = cityColor;
        this.color = CityColor3s[cityColor];
        
        this.pin = MeshBuilder.CreateSphere("pin-" + name, { diameter: 0.05 }, this.getScene());
        this.pin.material = this.map.plasticMaterials[this.cityColor];
        
        this.frame = new Mesh("frame", this.getScene());
        this.frame.scaling.copyFromFloats(1, 1, 1).scaleInPlace(2 * this.radius);
        this.frame.parent = this;
        this.map.tokenMeshData![1].vertexData.applyToMesh(this.frame);
        this.frame.material = this.map.frameMaterial;

        this.bottom = new Mesh("bottom", this.getScene());
        this.bottom.material = QuickMaterial(this.color);
        this.bottom.visibility = 0.5;
        this.bottom.parent = this.frame;
        this.map.tokenMeshData![2].vertexData.applyToMesh(this.bottom);

        this.picture = new Mesh("pic", this.getScene());
        this.picture.material = this.map.cityMaterial;
        this.picture.visibility = 0;
        this.picture.parent = this.frame;
        this.map.tokenMeshData![3].vertexData.applyToMesh(this.picture);
    }

    public update(): void {
        let camDir = this._scene.activeCamera!.getForwardRay().direction.scaleInPlace(-1)!;
        let angle = Angle(this.position, camDir);
        let visibility = 1 - angle / (Math.PI / 2);
        visibility = Math.max(0, Math.min(1, visibility));
        visibility = Easing.easeOutCubic(visibility);
        this.opacity.set(visibility);
        if (visibility > 0) {
            let p = Vector3.TransformCoordinates(new Vector3(0, 0, this.radius + 0.05), this.getWorldMatrix());
            let screenP = Vector3.Project(
                p,
                Matrix.Identity(),
                this._scene.getTransformMatrix(),
                this._scene.activeCamera?.viewport!
            );
            this.screenNorthX.set(screenP.x * this._scene.getEngine().getRenderWidth() / window.devicePixelRatio);
            this.screenNorthY.set(screenP.y * this._scene.getEngine().getRenderHeight() / window.devicePixelRatio);

            p = Vector3.TransformCoordinates(new Vector3(0, 0, - this.radius - 0.05), this.getWorldMatrix());
            screenP = Vector3.Project(
                p,
                Matrix.Identity(),
                this._scene.getTransformMatrix(),
                this._scene.activeCamera?.viewport!
            );
            this.screenSouthX.set(screenP.x * this._scene.getEngine().getRenderWidth() / window.devicePixelRatio);
            this.screenSouthY.set(screenP.y * this._scene.getEngine().getRenderHeight() / window.devicePixelRatio);
        }
    }

    public updatePosition() {
        this.map.projection.projectToRef(this.lat, this.long, this.basePosition);
        this.pin!.position.copyFrom(this.basePosition);

        this.position.copyFrom(this.basePosition);        
        this.map.projection.constraintHoveredRef(this.position, this.rotationQuaternion);
    }

    public updateLine(): void {
        if (!this.line) {
            this.line = new Mesh("line", this.getScene());
            this.line.visibility = 1;
            this.line.material = QuickMaterial(this.color, 0, this.color);
        }

        let delta = this.position.subtract(this.basePosition);
        MakeOrthogonalInPlace(delta, this.position);
        if (delta.length() > this.radius) {
            let p0 = this.basePosition.clone();
            let p1 = this.position.clone();
            let dir = p0.subtract(p1).normalize();
            MakeOrthogonalInPlace(dir, p1).normalize();
            p1.addInPlace(dir.scale(this.radius * 0.95));
            let count = Math.round(Vector3.Distance(p0, p1) / 0.5);
            let line = [p0];
            for (let n = 1; n < count; n++) {
                let f = n / count;
                let pt = p0.scale(1 - f).addInPlace(p1.scale(f));
                let pt0 = pt.clone();
                this.map.projection.constraintRef(pt0);
                let pt1 = pt.clone();
                this.map.projection.constraintHoveredRef(pt1);
                pt = pt0.scale(1 - f).addInPlace(pt1.scale(f));

                line.push(pt);
            }
            line.push(p1);
            
            CreateTrailVertexData({ path: line, up: p0, radius: 0.005 }).applyToMesh(this.line);
        }

        this.links.forEach(link => link.updateMesh());
    }

    private _infectionPositions: Vector3[] = [
        new Vector3(0, 0.15, 0.15),
        new Vector3(0.1, 0.45, 0.3),
        new Vector3(0.2, 0.75, 0.45)
    ];
    public updateInfectionsMeshes(): void {
        let count = 0;
        for (let c = 0; c < this.infections.length; c++) {
            for (let n = 0; n < this.infections[c](); n++) {
                count++;
            }
        }
        this.picture!.visibility = count / 3;
        if (count > 0) {
            let index = count - 1;
            index = Math.min(2, index);
            //this.frame!.material = this.map.alertFrameMaterials[index];
            //this.frame!.material = this.map.darkFrameMaterial;
            this.picture!.material = this.map.alertCityMaterials[index];
        }
        else {
            //this.frame!.material = this.map.frameMaterial;
            this.picture!.material = this.map.cityMaterial;
        }
    }

    public async infect(diseaseColor: CityColor): Promise<void> {
        this.infections[diseaseColor].set(this.infections[diseaseColor]() + 1);
        
        let n = this.tokens.length;
        let infectionMesh = new InfectionToken(this, diseaseColor);
        this.tokens.push(infectionMesh);

        let alpha = - Math.PI / 3.5 + Math.PI / 3.5 * n;
        let pos = new Vector3(
            (this.radius + 0.05) * Math.sin(alpha),
            0.1,
            (this.radius + 0.05) * Math.cos(alpha)
        );
        await infectionMesh.animatePosition(pos, 0);
        infectionMesh.rotation.y = Math.PI + alpha;

        this.updateInfectionsMeshes();
        await infectionMesh.animateSize(0.35, 0.5, Easing.easeOutCubic);

    }

    public stepUpdate(smoothness: number = 100): number {
        let cumulativeCorrection = 0;
        for (const otherCity of this.map.cities) {
            if (otherCity === this) continue;
            const distanceSquared = Vector3.DistanceSquared(this.position, otherCity.position);
            if (distanceSquared < this.map.projection.cityDistance * this.map.projection.cityDistance) {
                const direction = this.position.subtract(otherCity.position).normalize();
                const correction = (this.map.projection.cityDistance * this.map.projection.cityDistance - distanceSquared) / 2 / smoothness;
                this.position.addInPlace(direction.scale(correction));
                this.map.projection.constraintHoveredRef(this.position, this.rotationQuaternion);
                //this.updateLine();
                cumulativeCorrection += correction;

                otherCity.position.addInPlace(direction.scale(-correction));
                this.map.projection.constraintHoveredRef(otherCity.position, otherCity.rotationQuaternion);
                //otherCity.updateLine();
            }
        }
        //if (this.cityId === CityID.Atlanta) {
        //    this.position = Vector3.Lerp(this.position, this.basePosition, 0.01);
        //    this.map.projection.constraintHoveredRef(this.position, this.rotationQuaternion);
        //}
        return cumulativeCorrection;
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