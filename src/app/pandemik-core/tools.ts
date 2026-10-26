import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.pure";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";


export function QuickMaterial(color: Color3, specularIntensity: number = 0, emissiveIntensity: number = 0) {
    const material = new StandardMaterial("quickMaterial");
    material.diffuseColor = color;
    material.specularColor.set(specularIntensity, specularIntensity, specularIntensity);
    material.emissiveColor.set(emissiveIntensity, emissiveIntensity, emissiveIntensity);
    return material;
}

export function MakeOutline(mesh: Mesh, color: Color3, width: number = 0.02) {
    mesh.renderOutline = true;
    mesh.outlineColor = color;
    mesh.outlineWidth = width;
    return mesh;
}