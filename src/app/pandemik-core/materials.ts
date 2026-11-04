import { Pandemik } from "./pandemik";
import { City } from "./city";
import type { Material } from '@babylonjs/core/Materials/material.pure';
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture.pure';
import { PBRMetallicRoughnessMaterial } from '@babylonjs/core/Materials/PBR/pbrMetallicRoughnessMaterial.pure';
import { Color3, Texture } from "@babylonjs/core";
import { GameColor3s } from "./data";
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
    public cityMaterials: Map<string, Material> = new Map();
    public alertCityMaterials: Material[] = [];
    public plasticMaterials: Material[] = [];
    public get whitePlasticMaterial(): Material {
        return this.plasticMaterials[4];
    }
    public get redPlasticMaterial(): Material {
        return this.plasticMaterials[5];
    }
    public apMaterial: PBRMetallicRoughnessMaterial;
    public apMaterialOff: PBRMetallicRoughnessMaterial;

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
            let mat = QuickMaterial(GameColor3s[i], 0, GameColor3s[i].scale(0.5));
            mat.diffuseTexture = new Texture("virus.png", this.pandemik.scene!, undefined, false);
            mat.diffuseTexture.hasAlpha = true;
            mat.useAlphaFromDiffuseTexture = true;
            this.infectionMaterials.push(mat);
        }

        let cityMaterial = QuickMaterial(Color3.White());
        cityMaterial.alpha = 0;
        this.cityMaterial = cityMaterial;

        this._loadCityMaterial("London");
        //this._loadCityMaterial("Essen");
        //this._loadCityMaterial("Milano");
        this._loadCityMaterial("Paris");
        this._loadCityMaterial("Madrid");
        this._loadCityMaterial("Montreal");
        this._loadCityMaterial("NewYork");
        this._loadCityMaterial("Washington");
        this._loadCityMaterial("Atlanta");
        this._loadCityMaterial("Chicago");
        //this._loadCityMaterial("SaintPetersburg");
        //this._loadCityMaterial("LosAngeles");
        //this._loadCityMaterial("MexicoCity");
        //this._loadCityMaterial("Miami");
        //this._loadCityMaterial("Bogota");
        //this._loadCityMaterial("Lima");
        //this._loadCityMaterial("Santiago");
        //this._loadCityMaterial("BuenosAires");
        //this._loadCityMaterial("SaoPaulo");
        //this._loadCityMaterial("Lagos");
        //this._loadCityMaterial("Kinshasa");
        //this._loadCityMaterial("Khartoum");
        //this._loadCityMaterial("Johannesburg");
        //this._loadCityMaterial("Moscow");
        //this._loadCityMaterial("Istanbul");
        //this._loadCityMaterial("Cairo");
        //this._loadCityMaterial("Algiers");
        //this._loadCityMaterial("Tehran");
        //this._loadCityMaterial("Baghdad");
        //this._loadCityMaterial("Beijing");
        //this._loadCityMaterial("Seoul");
        //this._loadCityMaterial("Tokyo");
        //this._loadCityMaterial("Shanghai");
        //this._loadCityMaterial("HongKong");
        //this._loadCityMaterial("Bangkok");
        //this._loadCityMaterial("Taipei");
        //this._loadCityMaterial("Osaka");
        //this._loadCityMaterial("Manila");
        //this._loadCityMaterial("HoChiMinhCity");
        //this._loadCityMaterial("Jakarta");
        //this._loadCityMaterial("Sydney");

        for (let i = 0; i < 3; i++) {
            let alertCityMaterial = QuickMaterial(Color3.White(), 0, RedColor.scale((i + 1) / 3).scale(0.5));
            alertCityMaterial.diffuseTexture = new Texture("biohazard-red.png", this.pandemik.scene!);
            alertCityMaterial.diffuseTexture.hasAlpha = true;
            alertCityMaterial.useAlphaFromDiffuseTexture = true;
            alertCityMaterial.alpha = (i + 1) / 3;
            this.alertCityMaterials.push(alertCityMaterial);
        }
        
        this.plasticMaterials = [];
        for (let n = 0; n < GameColor3s.length; n++) {
            this.plasticMaterials[n] = this._makePlasticPBR("", GameColor3s[n], this.environmentTexture);
        }
        this.plasticMaterials.push(this._makePlasticPBR("", Color3.White(), this.environmentTexture));
        this.plasticMaterials.push(this._makePlasticPBR("", RedColor, this.environmentTexture));

        this.apMaterial = this._makePlasticPBR("", Color3.FromInts(0, 255, 149), this.environmentTexture);
        this.apMaterial.emissiveColor = Color3.FromInts(0, 255, 149);

        this.apMaterialOff = this._makePlasticPBR("", Color3.FromInts(0 / 8, 255 / 8, 149 / 8), this.environmentTexture);
    }

    private _loadCityMaterial(cityId: string): void {
        let name = cityId.toLocaleLowerCase();
        name = name.split('').filter(c => c >= 'a' && c <= 'z').join('');
        let material = QuickMaterial(Color3.White(), 0.2);
        /*
        material.diffuseTexture = new Texture(name + ".png", this.pandemik.scene!);
        material.diffuseTexture!.hasAlpha = true;
        material.useAlphaFromDiffuseTexture = true;
        material.emissiveTexture = material.diffuseTexture;
        */

        let imgElement = document.createElement("img");
        imgElement.src = name + ".png";
        imgElement.onload = () => {
            let imgWidth = imgElement.width;
            let imgHeight = imgElement.height;
            let s = Math.min(imgElement.width, imgElement.height);
            let canvas = document.createElement("canvas");
            canvas.width = s;
            canvas.height = s;
            console.log("size = " + s);
            let ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(imgElement, (imgWidth - s) / 2, (imgHeight - s) / 2, s, s, 0, 0, s, s);
                let pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let colBackground = Color3.FromHexString("#4a03bb");
                let r0 = colBackground.r * 255;
                let g0 = colBackground.g * 255;
                let b0 = colBackground.b * 255;
                let colLight = Color3.FromHexString("#00ffdd");
                let r1 = colLight.r * 255;
                let g1 = colLight.g * 255;
                let b1 = colLight.b * 255;
                for (let n = 0; n < pixelData.data.length; n += 4) {
                    let r = pixelData.data[n];
                    let g = pixelData.data[n+1];
                    let b = pixelData.data[n+2];
                    let v = 1 - (r + g + b) / 3 / 255;
                    v = Math.round(v * 7) / 7;
                    pixelData.data[n] = r0 * (1 - v) + r1 * v;
                    pixelData.data[n+1] = g0 * (1 - v) + g1 * v;
                    pixelData.data[n+2] = b0 * (1 - v) + b1 * v;
                    pixelData.data[n+3] = v * 255;
                }
                ctx.putImageData(pixelData, 0, 0);
            }
            material.diffuseTexture = new Texture(canvas.toDataURL(), null, false, true);
            material.diffuseTexture!.hasAlpha = true;
            material.useAlphaFromDiffuseTexture = true;
            material.emissiveTexture = material.diffuseTexture;
            material.emissiveColor = new Color3(0.3, 0.3, 0.3);
        };

        this.cityMaterials.set(cityId, material);
    }

    private _makeMetalPBR(name: string, color: Color3, envTexture: CubeTexture): PBRMetallicRoughnessMaterial {
        let metalMaterial = new PBRMetallicRoughnessMaterial(name, this.pandemik.scene!);
        metalMaterial.baseColor = color;
        metalMaterial.metallic = 0.85;
        metalMaterial.roughness = 0.15;
        metalMaterial.environmentTexture = envTexture;

        return metalMaterial;
    }
    
    private _makePlasticPBR(name: string, color: Color3, envTexture: CubeTexture): PBRMetallicRoughnessMaterial {
        let plastic = new PBRMetallicRoughnessMaterial(name, this.pandemik.scene!);
        plastic.baseColor = color;
        plastic.roughness = 1;
        plastic.environmentTexture = envTexture;

        return plastic;
    }

    private _timer: number = 0;
    public update(): void {
        return;
        this._timer += this.pandemik.scene.deltaTime / 1000;
        const P = 1.5;
        const f = (Math.sin(this._timer * Math.PI * 2 / P) + 1) * 0.5;
        const f2 = (Math.sin(this._timer * Math.PI * 2 / (2 * P)) + 1) * 0.5;
        for (const alertCityMaterial of this.alertCityMaterials) {
            alertCityMaterial.alpha = f * f2;
        }
    }
}