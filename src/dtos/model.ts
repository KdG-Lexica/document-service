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
}

export interface CreateModelDto {
  meta: CreateMetaDto[],
  mappings: Record<string, string>,
  title: string,
  description: string;
  cosineArray: string,
  mongoCollection: MongoCollection
}