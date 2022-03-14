import IPTCSet from "../models/IPTCSet";
import IPTCMeta, { IPTCMetaAttributes } from "../models/IPTCMeta";

import mongoose, { Schema } from 'mongoose';
import { IPTCMetaDto, IPTCDto } from "../dtos/iptc";


// TODO: duplicate code
const ensureCollection = (collectionName: string) => {
  let collection: any;
  try {
    const schema = new Schema({
      _id: String
    }, { strict: false, _id: false })
    collection = mongoose.model(collectionName, schema);
  } catch (error) {
    collection = mongoose.model(collectionName);
  }

  return collection;
}

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

export const CreateIPTCSet = async (name: string, mongoCollectionName: string): Promise<IPTCSet> => {
  const mongoCollection = ensureCollection(mongoCollectionName);

  const iptcSet = await IPTCSet.create({
    name
  });

  const meta: IPTCMetaAttributes[] = []

  await mongoCollection.find().cursor().eachAsync(async (iptc: any) => {
    if (!iptc) return;
    meta.push({
      IPTCSetId: iptcSet.id,
      label: iptc.label,
      level: iptc.level,
      vector$x: iptc['3d'][0],
      vector$y: iptc['3d'][1],
      vector$z: iptc['3d'][2]
    })
  })

  await IPTCMeta.bulkCreate(meta);

  return iptcSet;
}