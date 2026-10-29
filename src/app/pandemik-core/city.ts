import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { CityColor3s, CityID, type GameColor } from "./data";
import { Matrix, Quaternion } from "@babylonjs/core/Maths/math.vector.pure";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.pure";
import type { Scene } from "@babylonjs/core/scene";
import type { Nullable } from "@babylonjs/core/types";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { Board } from "./board";
import { CreateSphereVertexData } from "@babylonjs/core/Meshes/Builders/sphereBuilder.pure";
import { MakeOrthogonal, MakeOrthogonalInPlace, MakeOutline, QuickMaterial, RemoveOutline } from "./tools";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { Angle, CreateBeveledBox, CreateBeveledCylinder, CreateBeveledCylinderVertexData, CreateTrailVertexData, CreateWireVertexData, Easing, GetGLTFMeshDataArray } from "babylonjs-tiaratumgames-tools";
import { RedColor, GreyColor, TimeFactor } from "./constants";
import { signal } from "@angular/core";
import { Texture } from "@babylonjs/core/Materials/Textures/texture.pure";
import { InfectionToken } from "./infection-token";
import { CityToken } from "./city-token";
import { StationToken } from "./station-token";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode.pure";

export enum CityLinkType {
    Base,
    Station
}

export class CityLink extends Mesh {

    public get map(): Board {
        return this.cityA.board;
    }

    public cityLinkType: CityLinkType;
    public path: Vector3[] = [];

    constructor(public cityA: City, public cityB: City, cityLinkType: CityLinkType = CityLinkType.Base) {
        super(cityA.name + "-" + cityB.name, cityA.getScene());
        this.cityLinkType = cityLinkType;
        if (cityLinkType === CityLinkType.Base) {
            this.material = this.cityA.board.pandemik.sharedMaterials.frameMaterial;
        }
        else if (cityLinkType === CityLinkType.Station) {
            this.material = this.cityA.board.pandemik.sharedMaterials.plasticMaterials[4];
        }
        console.log(`Created city link between ${cityA.name} and ${cityB.name} of type ${cityLinkType}`);
    }

    public highlight(): void {
        if (this.cityLinkType === CityLinkType.Base) {
            this.material = this.cityA.board.pandemik.sharedMaterials.highlightFrameMaterial;
        }
        else if (this.cityLinkType === CityLinkType.Station) {
            this.material = this.cityA.board.pandemik.sharedMaterials.plasticMaterials[4];
        }
    }

    public unlit(): void {
        if (this.cityLinkType === CityLinkType.Base) {
            this.material = this.cityA.board.pandemik.sharedMaterials.frameMaterial;
        }
        else if (this.cityLinkType === CityLinkType.Station) {
            this.material = this.cityA.board.pandemik.sharedMaterials.plasticMaterials[4];
        }
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

        this.path = [p0];
        for (let n = 1; n < 30; n++) {
            let f = n / 30;
            let pt = p0.scale(1 - f).addInPlace(p1.scale(f));
            this.map.projection.constraintHoveredRef(pt);

            if (this.cityLinkType === CityLinkType.Station) {
                let h = Math.sin(f * Math.PI) * 2;
                pt.addInPlace(pt.clone().normalize().scale(h));
            }

            this.path.push(pt);
        }
        this.path.push(p1);
        
        let radius = 0.025;
        if (this.cityLinkType === CityLinkType.Station) {
            radius = 0.025;
        }
        CreateWireVertexData({ path: this.path, radiusFunc: (t) => { return radius; } }).applyToMesh(this);
    }
}

export class CityPart extends Mesh {
    constructor(name: string, scene: Nullable<Scene>, public city: City) {
        super(name, scene);
    }
}

export class City extends Mesh {

    public radius: number = 0.5;

    public cityId: CityID;
    public lat: number = 0;
    public long: number = 0;
    public basePosition: Vector3 = new Vector3(0, 0, 0);

    public pin: Mesh;
    public frame: CityPart;
    public bottom: CityPart;
    public picture: CityPart;
    public line: Nullable<Mesh> = null;
    public playerAnchor: TransformNode;

    public cityColor: GameColor;
    public color: Color3;

    public links: CityLink[] = [];
    public distanceTo: number[] = [];

    public infections = [
        signal<number>(0),
        signal<number>(0),
        signal<number>(0),
        signal<number>(0)
    ];
    public outbreaking: boolean = false;
    public tokens: CityToken[] = [];
    public hasStation = false;
    public station: Nullable<StationToken> = null;
    
	public screenNorthX = signal<number>(0);
	public screenNorthY = signal<number>(0);
	public screenEastX = signal<number>(0);
	public screenEastY = signal<number>(0);
	public screenSouthX = signal<number>(0);
	public screenSouthY = signal<number>(0);
	public opacity = signal<number>(0);

    public static Connect(cityA: City, cityB: City, cityLinkType: CityLinkType = CityLinkType.Base): boolean {
        let link = cityA.getLink(cityB);
        if (link) {
            return false;
        }
        link = new CityLink(cityA, cityB, cityLinkType);
        cityA.links.push(link);
        cityA.distanceTo[cityB.cityId] = 1;
        cityB.links.push(link);
        cityB.distanceTo[cityA.cityId] = 1;
        return true;
    }

    constructor(public board: Board, cityId: CityID, cityColor: GameColor, name: string, scene: Nullable<Scene>) {
        super(name, scene);
        this.cityId = cityId;
        this.rotationQuaternion = Quaternion.Identity();
        this.cityColor = cityColor;
        this.color = CityColor3s[cityColor];
        
        this.pin = MeshBuilder.CreateSphere("pin-" + name, { diameter: 0.05 }, this.getScene());
        this.pin.material = this.board.pandemik.sharedMaterials.plasticMaterials[this.cityColor];
        
        this.frame = new CityPart("city-frame", this.getScene(), this);
        this.frame.scaling.copyFromFloats(1, 1, 1).scaleInPlace(2 * this.radius);
        this.frame.parent = this;
        this.board.tokenMeshData[1]?.vertexData.applyToMesh(this.frame);
        this.frame.material = this.board.pandemik.sharedMaterials.frameMaterial;

        this.bottom = new CityPart("city-bottom", this.getScene(), this);
        this.bottom.material = QuickMaterial(this.color);
        this.bottom.visibility = 0.5;
        this.bottom.parent = this.frame;
        this.board.tokenMeshData[2]?.vertexData.applyToMesh(this.bottom);

        this.picture = new CityPart("city-pic", this.getScene(), this);
        this.picture.material = this.board.pandemik.sharedMaterials.cityMaterial;
        this.picture.visibility = 0;
        this.picture.parent = this.frame;
        this.picture.rotation.y = Math.PI;
        this.board.tokenMeshData[3]?.vertexData.applyToMesh(this.picture);

        if (this.board.pandemik.sharedMaterials.cityMaterials[this.cityId]) {
            this.picture.material = this.board.pandemik.sharedMaterials.cityMaterials[this.cityId];
            this.picture.visibility = 0.5;
        }

        this.playerAnchor = new TransformNode("player-anchor", this.getScene());
        this.playerAnchor.parent = this;
        let alpha = - 3 * Math.PI / 4;
        this.playerAnchor.position.copyFromFloats(
            (this.radius - 0.1) * Math.sin(alpha),
            0.1,
            (this.radius - 0.1) * Math.cos(alpha)
        );

        for (let i = 0; i < CityID.LAST; i++) {
            this.distanceTo[i] = Infinity;
        }
        this.distanceTo[this.cityId] = 0;
    }

    public select(): void {
        this.frame.material = this.board.pandemik.sharedMaterials.highlightFrameMaterial;
    }

    public unselect(): void {
        this.frame.material = this.board.pandemik.sharedMaterials.frameMaterial;
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
            
            p = Vector3.TransformCoordinates(new Vector3(this.radius + 0.05, 0, 0), this.getWorldMatrix());
            screenP = Vector3.Project(
                p,
                Matrix.Identity(),
                this._scene.getTransformMatrix(),
                this._scene.activeCamera?.viewport!
            );
            this.screenEastX.set(screenP.x * this._scene.getEngine().getRenderWidth() / window.devicePixelRatio);
            this.screenEastY.set(screenP.y * this._scene.getEngine().getRenderHeight() / window.devicePixelRatio);

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
        this.board.projection.projectToRef(this.lat, this.long, this.basePosition);
        this.pin!.position.copyFrom(this.basePosition);

        this.position.copyFrom(this.basePosition);        
        this.board.projection.constraintHoveredRef(this.position, this.rotationQuaternion);
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
                this.board.projection.constraintRef(pt0);
                let pt1 = pt.clone();
                this.board.projection.constraintHoveredRef(pt1);
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
            this.picture!.material = this.board.pandemik.sharedMaterials.alertCityMaterials[index];
        }
        else {
            //this.frame!.material = this.map.frameMaterial;
            this.picture!.material = this.board.pandemik.sharedMaterials.cityMaterial;
        }
    }

    public async infect(diseaseColor: GameColor): Promise<void> {
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
        await infectionMesh.animateSize(0.4, 0.5 * TimeFactor, Easing.easeOutCubic);
    }

    public async outbreakAnimate(diseaseColor: GameColor): Promise<void> {
        let infectionMeshes: InfectionToken[] = [];
        let promises: Promise<void>[] = [];
        for (const link of this.links) {
            let infectionMesh = new InfectionToken(this, diseaseColor);
            infectionMesh.parent = null;

            let path = link.path;
            if (link.cityB === this) {
                path = path.slice().reverse();
            }
            infectionMeshes.push(infectionMesh);
            promises.push(infectionMesh.popAndVanish(0.4, 1, 0.8));
            promises.push(infectionMesh.followPath(path, 1, Easing.easeInCubic));
        }
        await Promise.all(promises);
        for (const infectionMesh of infectionMeshes) {
            infectionMesh.dispose();
        }
    }

    public async cure(diseaseColor: GameColor): Promise<void> {
        if (this.infections[diseaseColor]() > 0) {
            this.infections[diseaseColor].set(this.infections[diseaseColor]() - 1);
            for (let i = this.tokens.length - 1; i >= 0; i--) {
                let token = this.tokens[i];
                if (token instanceof InfectionToken) {
                    if (token.diseaseColor === diseaseColor) {
                        let token = this.tokens.splice(i, 1)[0];
                        this.fixAllTokensPositions(1);
                        await token.animateSize(0, 0.5, Easing.easeOutCubic);
                        token.dispose();
                        i = -1;
                    }
                }
            }
            this.updateInfectionsMeshes();
        }
    }

    public async buildStation(): Promise<void> {
        if (!this.hasStation) {
            this.hasStation = true;
            this.station = new StationToken(this);
            let pos = new Vector3(
                this.radius + 0.2,
                0.1,
                0
            );
            await this.station.animatePosition(pos, 0);
            await this.station.animateSize(0.35, 0.5, Easing.easeOutCubic);
            this.board.connectAllStation();
        }
    }

    public async fixAllTokensPositions(duration: number): Promise<void> {
        for (let i = 0; i < this.tokens.length; i++) {
            let token = this.tokens[i];
            let alpha = - Math.PI / 3.5 + Math.PI / 3.5 * i;
            let pos = new Vector3(
                (this.radius + 0.05) * Math.sin(alpha),
                0.1,
                (this.radius + 0.05) * Math.cos(alpha)
            );
            token.animatePosition(pos, duration);
            token.rotation.y = Math.PI + alpha;
        }
    }

    public stepUpdate(smoothness: number = 100): number {
        let cumulativeCorrection = 0;
        for (const otherCity of this.board.cities) {
            if (otherCity === this) continue;
            const distanceSquared = Vector3.DistanceSquared(this.position, otherCity.position);
            if (distanceSquared < this.board.projection.cityDistance * this.board.projection.cityDistance) {
                const direction = this.position.subtract(otherCity.position).normalize();
                const correction = (this.board.projection.cityDistance * this.board.projection.cityDistance - distanceSquared) / 2 / smoothness;
                this.position.addInPlace(direction.scale(correction));
                this.board.projection.constraintHoveredRef(this.position, this.rotationQuaternion);
                //this.updateLine();
                cumulativeCorrection += correction;

                otherCity.position.addInPlace(direction.scale(-correction));
                this.board.projection.constraintHoveredRef(otherCity.position, otherCity.rotationQuaternion);
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

    public shareDistanceMapWithConnected(): boolean {
        let updated = false;
        for (const link of this.links) {
            const otherCity = link.other(this);
            if (otherCity) {
                updated = updated || this.shareDistanceMap(otherCity);
            }
        }
        return updated;
    }

    public shareDistanceMap(otherCity: City): boolean {
        let updated = false;
        for (let i = 0; i < CityID.LAST; i++) {
            const newDistance = Math.min(this.distanceTo[i], otherCity.distanceTo[i] + 1);
            if (newDistance < this.distanceTo[i]) {
                this.distanceTo[i] = newDistance;
                updated = true;
            }
        }
        return updated;
    }
}