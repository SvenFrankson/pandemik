import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.pure";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure";
import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";


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