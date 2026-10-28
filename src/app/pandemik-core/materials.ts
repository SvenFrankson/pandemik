import { Pandemik } from "./pandemik";
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture.pure';
import type { Material } from '@babylonjs/core/Materials/material.pure';
import { PBRMetallicRoughnessMaterial } from '@babylonjs/core/Materials/PBR/pbrMetallicRoughnessMaterial.pure';
import { Color3, Texture } from "@babylonjs/core";
import { CityColor3s } from "./data";
import { QuickMaterial } from "./tools";
import { RedColor } from "./constants";

export class SharedMaterials {

    public environmentTexture: CubeTexture;
    public frameMaterial: PBRMetallicRoughnessMaterial;
    public highlightFrameMaterial: PBRMetallicRoughnessMaterial;
    public alertFrameMaterials: PBRMetallicRoughnessMaterial[] = [];
    public darkFrameMaterial: PBRMetallicRoughnessMaterial;
    public infectionMaterial: Material;
    public infectionMaterials: Material[] = [];
    public cityMaterial: Material;
    public alertCityMaterials: Material[] = [];
    public plasticMaterials: Material[] = [];
    public get whitePlasticMaterial(): Material {
        return this.plasticMaterials[4];
    }
    public get redPlasticMaterial(): Material {
        return this.plasticMaterials[5];
    }

    constructor(public pandemik: Pandemik) {
        this.environmentTexture = CubeTexture.CreateFromPrefilteredData("environmentSpecular.env", this.pandemik.scene!);

        this.frameMaterial = this._makeMetalPBR("steel-pbr", new Color3(0.6, 0.8, 1.0), this.environmentTexture) as PBRMetallicRoughnessMaterial;

        this.highlightFrameMaterial = this._makeMetalPBR("steel-pbr", new Color3(0.6, 0.8, 1.0), this.environmentTexture) as PBRMetallicRoughnessMaterial;
        this.highlightFrameMaterial.emissiveColor = Color3.White().scaleInPlace(0.3);
        
        let alert1FrameMaterialPBR = this._makeMetalPBR("alert-1", Color3.FromHexString("#ccc127"), this.environmentTexture) as PBRMetallicRoughnessMaterial;
        //alert1FrameMaterialPBR.emissiveColor = Color3.White().scale(0.05);
        this.alertFrameMaterials.push(alert1FrameMaterialPBR);
        
        let alert2FrameMaterialPBR = this._makeMetalPBR("alert-2", Color3.FromHexString("#c77a21"), this.environmentTexture) as PBRMetallicRoughnessMaterial;
        //alert2FrameMaterialPBR.emissiveColor = Color3.White().scale(0.05);
        this.alertFrameMaterials.push(alert2FrameMaterialPBR);
        
        let alert3FrameMaterialPBR = this._makeMetalPBR("alert-3", Color3.FromHexString("#c52828"), this.environmentTexture) as PBRMetallicRoughnessMaterial;
        //alert3FrameMaterialPBR.emissiveColor = Color3.White().scale(0.05);
        this.alertFrameMaterials.push(alert3FrameMaterialPBR);

        this.darkFrameMaterial = this._makeMetalPBR("steel-pbr", new Color3(0.2, 0.25, 0.3), this.environmentTexture) as PBRMetallicRoughnessMaterial;

        let infectionMaterial = QuickMaterial(Color3.White(), 0, Color3.White().scale(0.5));
        infectionMaterial.diffuseTexture = new Texture("virus.png", this.pandemik.scene!, undefined, false);
        infectionMaterial.diffuseTexture.hasAlpha = true;
        infectionMaterial.useAlphaFromDiffuseTexture = true;
        this.infectionMaterial = infectionMaterial;

        for (let i = 0; i <= 3; i++) {   
            let mat = QuickMaterial(CityColor3s[i], 0, CityColor3s[i].scale(0.5));
            mat.diffuseTexture = new Texture("virus.png", this.pandemik.scene!, undefined, false);
            mat.diffuseTexture.hasAlpha = true;
            mat.useAlphaFromDiffuseTexture = true;
            this.infectionMaterials.push(mat);
        }

        let cityMaterial = QuickMaterial(Color3.White(), 0, Color3.Red());
        cityMaterial.diffuseTexture = new Texture("biohazard.png", this.pandemik.scene!, undefined, false);
        cityMaterial.diffuseTexture.hasAlpha = true;
        cityMaterial.useAlphaFromDiffuseTexture = true;
        this.cityMaterial = cityMaterial;

        for (let i = 0; i < 3; i++) {
            let alertCityMaterial = QuickMaterial(Color3.White(), 0, Color3.Red().scale((i + 1) / 3).scale(0.5));
            alertCityMaterial.diffuseTexture = new Texture("biohazard.png", this.pandemik.scene!, undefined, false);
            alertCityMaterial.diffuseTexture.hasAlpha = true;
            alertCityMaterial.useAlphaFromDiffuseTexture = true;
            this.alertCityMaterials.push(alertCityMaterial);
        }
        
        this.plasticMaterials = [];
        for (let n = 0; n < CityColor3s.length; n++) {
            this.plasticMaterials[n] = this._makePlasticPBR("", CityColor3s[n], this.environmentTexture);
        }
        this.plasticMaterials.push(this._makePlasticPBR("", Color3.White(), this.environmentTexture));
        this.plasticMaterials.push(this._makePlasticPBR("", RedColor, this.environmentTexture));
    }

    private _makeMetalPBR(name: string, color: Color3, envTexture: CubeTexture): Material {
        let metalMaterial = new PBRMetallicRoughnessMaterial(name, this.pandemik.scene!);
        metalMaterial.baseColor = color;
        metalMaterial.metallic = 0.85;
        metalMaterial.roughness = 0.15;
        metalMaterial.environmentTexture = envTexture;

        return metalMaterial;
    }
    
    private _makePlasticPBR(name: string, color: Color3, envTexture: CubeTexture): Material {
        let plastic = new PBRMetallicRoughnessMaterial(name, this.pandemik.scene!);
        plastic.baseColor = color;
        plastic.roughness = 1;
        plastic.environmentTexture = envTexture;

        return plastic;
    }
}