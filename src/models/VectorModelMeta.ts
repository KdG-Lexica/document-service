import { sql } from '../db';

import { DataTypes, Model, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyCountAssociationsMixin } from 'sequelize';


export interface VectorModelMetaAttributes {
  id: number,
  VectorModelId: number,
  key: string,
  type: string,
  name: string
}


class VectorModelMeta extends Model<VectorModelMetaAttributes> implements VectorModelMetaAttributes {
  public id: number;
  public VectorModelId: number;
  public key: string;
  public type: string;
  public name: string;
}

VectorModelMeta.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  VectorModelId: {
    type: DataTypes.INTEGER,
  },
  key: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  }
}, {
    sequelize: sql,
    createdAt: false,
    updatedAt: false,
})

export default VectorModelMeta;