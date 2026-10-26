import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { CityColor3s, CityID, type CityColor } from "./data";
import { Matrix, Quaternion } from "@babylonjs/core/Maths/math.vector.pure";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.pure";
import type { Scene } from "@babylonjs/core/scene";
import type { Nullable } from "@babylonjs/core/types";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { PandemikMap } from "./pandemik-map";
import { CreateSphereVertexData } from "@babylonjs/core/Meshes/Builders/sphereBuilder.pure";
import { MakeOrthogonal, MakeOrthogonalInPlace, MakeOutline, QuickMaterial } from "./tools";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { Angle, CreateBeveledBox, CreateBeveledCylinder, CreateBeveledCylinderVertexData, CreateTrailVertexData, GetGLTFMeshDataArray } from "babylonjs-tiaratumgames-tools";
import { RedColor, GreyColor } from "./constants";
import { signal } from "@angular/core";
import { Texture } from "@babylonjs/core/Materials/Textures/texture.pure";

export class CityLink extends Mesh {

    public get map(): PandemikMap {
        return this.cityA.map;
    }

    constructor(public cityA: City, public cityB: City) {
        super(cityA.name + "-" + cityB.name, cityA.getScene());
        this.material = QuickMaterial(Color3.White(), 0, 1);
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
        
        CreateTrailVertexData({ path: line, up: p0.add(p1).normalize(), radiusFunc: (t) => { return 0.03; } }).applyToMesh(this);
    }
}

export class City extends Mesh {

    public radius: number = 0.4;

    public cityId: CityID;
    public lat: number = 0;
    public long: number = 0;
    public basePosition: Vector3 = new Vector3(0, 0, 0);

    public frame: Nullable<Mesh> = null;
    public bottom: Nullable<Mesh> = null;
    public picture: Nullable<Mesh> = null;
    public line: Nullable<Mesh> = null;

    public cityColor: CityColor;
    public color: Color3;

    public links: CityLink[] = [];

    public infections: number = 0;
    public infectionsMeshes: Mesh[] = [];
    
	public screenX = signal<number>(0);
	public screenY = signal<number>(0);
	public shown = signal<boolean>(true);

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

    constructor(public map: PandemikMap, cityId: CityID, cityColor: CityColor, name: string, scene: Nullable<Scene>) {
        super(name, scene);
        this.cityId = cityId;
        this.rotationQuaternion = Quaternion.Identity();
        this.cityColor = cityColor;
        this.color = CityColor3s[cityColor];
        
        this.frame = new Mesh("frame", this.getScene());
        this.frame.scaling.copyFromFloats(1, 1, 1).scaleInPlace(2 * this.radius);
        this.frame.parent = this;
        this.map.tokenMeshData![1].vertexData.applyToMesh(this.frame);
        this.frame.material = QuickMaterial(Color3.White(), 0, 0.25);

        this.bottom = new Mesh("bottom", this.getScene());
        this.bottom.material = QuickMaterial(this.color);
        this.bottom.visibility = 0.5;
        this.bottom.parent = this.frame;
        this.map.tokenMeshData![2].vertexData.applyToMesh(this.bottom);

        this.infections = Math.floor(Math.random() * 5);
        this.updateInfectionsMeshes();
    }

    public update(): void {
        let camDir = this._scene.activeCamera!.getForwardRay().direction.scaleInPlace(-1)!;
        let angle = Angle(this.position, camDir);
        this.shown.set(angle < 0.8 * Math.PI / 2);
        if (this.shown()) {
            let p = Vector3.TransformCoordinates(new Vector3(0, 0, - this.radius - 0.05), this.getWorldMatrix());
            let screenP = Vector3.Project(
                p,
                Matrix.Identity(),
                this._scene.getTransformMatrix(),
                this._scene.activeCamera?.viewport!
            );
            this.screenX.set(screenP.x * this._scene.getEngine().getRenderWidth());
            this.screenY.set(screenP.y * this._scene.getEngine().getRenderHeight());
        }
    }

    public updatePosition() {
        this.map.projection.projectToRef(this.lat, this.long, this.basePosition);
        this.position.copyFrom(this.basePosition);        
        this.map.projection.constraintHoveredRef(this.position, this.rotationQuaternion);
    }

    public updateLine(): void {
        if (!this.line) {
            this.line = new Mesh("line", this.getScene());
            this.line.visibility = 1;
            this.line.material = QuickMaterial(this.color, 0, 0);
        }

        let delta = this.position.subtract(this.basePosition);
        MakeOrthogonalInPlace(delta, this.position);
        if (delta.length() < this.radius) {
            return;
        }
        let p0 = this.basePosition.clone();
        let p1 = this.position.clone();
        let dir = p0.subtract(p1).normalize();
        dir = MakeOrthogonal(dir, p1);
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
        
        CreateTrailVertexData({ path: line, up: p0, radiusFunc: (t) => { return 0.03 * t + 0.01; } }).applyToMesh(this.line);

        this.links.forEach(link => link.updateMesh());
    }

    private _infectionPositions: Vector3[] = [
        new Vector3(0, 0.15, 0.15),
        new Vector3(0.1, 0.45, 0.3),
        new Vector3(0.2, 0.75, 0.45)
    ];
    public updateInfectionsMeshes(): void {
        while (this.infectionsMeshes.length > 0) {
            this.infectionsMeshes.pop()?.dispose();
        }
        for (let n = 0; n < this.infections; n++) {
            let infectionMesh = new Mesh("infection", this.getScene());
            infectionMesh.scaling.copyFromFloats(0.4, 0.4, 0.4);
            this.map.tokenMeshData![1].vertexData.applyToMesh(infectionMesh);

            let bottom = new Mesh("pic", this.getScene());
            this.map.tokenMeshData![2].vertexData.applyToMesh(bottom);
            bottom.parent = infectionMesh;

            let pic = new Mesh("pic", this.getScene());
            this.map.tokenMeshData![3].vertexData.applyToMesh(pic);
            pic.parent = infectionMesh;
            
            this.infectionsMeshes.push(infectionMesh);
            let alpha = - Math.PI / 3 + Math.PI / 3 * n;
            infectionMesh.position.x = (this.radius + 0.1) * Math.sin(alpha);
            infectionMesh.position.y = 0.1;
            infectionMesh.position.z = (this.radius + 0.1) * Math.cos(alpha);
            infectionMesh.parent = this;

            infectionMesh.material = QuickMaterial(Color3.White(), 0, 0.25);
            bottom.material = QuickMaterial(CityColor3s[this.cityColor]);

            let materialPic = QuickMaterial(Color3.White(), 0, 1);
            materialPic.diffuseTexture = new Texture("virus.png", this.getScene());
            materialPic.diffuseTexture.hasAlpha = true;
            materialPic.useAlphaFromDiffuseTexture = true;
            pic.material = materialPic;
            //MakeOutline(infectionMesh, Color3.White());
        }
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