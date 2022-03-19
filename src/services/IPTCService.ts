import IPTCSet from "../models/IPTCSet";
import IPTCMeta, { IPTCMetaAttributes } from "../models/IPTCMeta";


import { IPTCMetaDto, IPTCDto } from "../dtos/iptc";
import { MongoCollection } from "../dtos/model";
import { connectMongo } from "../db";


export const ListIPTCSets = () => {
  return IPTCSet.findAll();
}

export const GetIPTCSet = async (id: number): Promise<IPTCDto> => {

  const result = await IPTCSet.findByPk(id, {
    include: [{
      model: IPTCMeta,
    }]
  });

  const arr: IPTCMetaDto[] = result.IPTCMeta.map(e => {
    return {
      vector3: {
        x: e.vector$x,
        y: e.vector$y,
        z: e.vector$z
      },
      level: e.level,
      label: e.label,
    }
  })


  return {
    id: result.id,
    name: result.name,
    meta: arr
  }
}

export const CreateIPTCSet = async (name: string, mongo: MongoCollection): Promise<IPTCSet> => {
  const mongoClient = await connectMongo(mongo)
  const mongoCollection = mongoClient.db(mongo.db).collection(mongo.collection);

  const iptcSet = await IPTCSet.create({
    name
  });

  const meta: IPTCMetaAttributes[] = [];

  const cursor = mongoCollection.find({});

  while (await cursor.hasNext()) {
    const iptc = await cursor.next();
    meta.push({
      IPTCSetId: iptcSet.id,
      label: iptc.label,
      level: iptc.level,
      vector$x: iptc['3d'][0],
      vector$y: iptc['3d'][1],
      vector$z: iptc['3d'][2]
    })
  }

  await IPTCMeta.bulkCreate(meta);

  return iptcSet;
}