import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.pure";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";


export function QuickMaterial(color: Color3, specularIntensity: number = 0) {
    const material = new StandardMaterial("quickMaterial");
    material.diffuseColor = color;
    material.specularColor.set(specularIntensity, specularIntensity, specularIntensity);
    return material;
}