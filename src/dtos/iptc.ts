import { MongoCollection } from "./model";
import Vector3Type from "./vector3"

export interface IPTCDto {
  id: number,
  name: string,
  meta?: IPTCMetaDto[]
}

export interface IPTCMetaDto {
  vector3: Vector3Type,
  level: number,
  label: string;
}

export interface CreateIPTCDto {
  name: string;
  mongoCollection: MongoCollection,
}