import Vector3 from "./vector3";

export default interface DocumentType {
    id: string,
    name: string,
    date: Date,
    vector3: Vector3
}