import VectorModelMeta from "../models/VectorModelMeta";
import VectorModelMapping from "../models/VectorModelMapping";
import Vector3Type from "./vector3";

export interface CreateMetaDto {
  key: string,
  type: string,
  name: string;
}

export interface MongoCollection {
  collection: string,
  db: string,
  host: string,
  port: string,
  username: string,
  password: string,
  srv: boolean,
}

export interface CreateModelDto {
  meta: CreateMetaDto[],
  mappings: Record<string, string>,
  title: string,
  description: string;
  cosineArray: string,
  mongoCollection: MongoCollection,
  password: string,
}


export interface ModelDto {
  id: number,
  collectionName: string,
  cosineArray: string,
  description: string,
  documentCount: number,
  center: Vector3Type,
  meta: VectorModelMeta[],
  mappings: VectorModelMapping[],
  requiresPassword: boolean,
  unlocked: boolean,
  title: string
}