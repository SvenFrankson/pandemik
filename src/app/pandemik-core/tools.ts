import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.pure";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";


export function QuickMaterial(color: Color3, specularIntensity: number = 0, emissiveColor: Color3 = Color3.Black()) {
    const material = new StandardMaterial("quickMaterial");
    material.diffuseColor = color;
    material.specularColor.set(specularIntensity, specularIntensity, specularIntensity);
    material.emissiveColor = emissiveColor;
    return material;
}

export function MakeOutline(mesh: Mesh | null, color: Color3, width: number = 0.02) {
    if (mesh) {
        mesh.renderOutline = true;
        mesh.outlineColor = color;
        mesh.outlineWidth = width;
    }
    return mesh;
}

export function RemoveOutline(mesh: Mesh | null) {
    if (mesh) {
        mesh.renderOutline = false;
    }
    return mesh;
}

export function MakeOrthogonal(v: Vector3, n: Vector3): Vector3 {
    let ref = Vector3.Zero();
    return MakeOrthogonalToRef(v, n, ref);
}

export function MakeOrthogonalInPlace(v: Vector3, n: Vector3): Vector3 {
    return MakeOrthogonalToRef(v, n, v);
}

export function MakeOrthogonalToRef(v: Vector3, n: Vector3, ref: Vector3): Vector3 {
    const normal = n.clone().normalize();
    const copy = v.clone();
    const dot = Vector3.Dot(copy, normal);
    ref.copyFrom(normal).scaleInPlace(- dot);
    ref.addInPlace(copy);
    return ref;
}