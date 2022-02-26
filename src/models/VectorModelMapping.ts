import { db } from '../db';

import { DataTypes, Model, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyCountAssociationsMixin } from 'sequelize';


export interface VectorModelMappingAttributes {
  id?: number,
  VectorModelId?: number,
  key: string,
  value: string,
}


class VectorModelMapping extends Model<VectorModelMappingAttributes> implements VectorModelMappingAttributes {
  declare id: number;
  declare VectorModelId: number;
  declare key: string;
  declare value: string;
}

VectorModelMapping.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  VectorModelId: {
    type: DataTypes.INTEGER,
  },
  key: {
    type: DataTypes.STRING,
  },
  value: {
    type: DataTypes.STRING
  }
}, {
  sequelize: db,
  createdAt: false,
  updatedAt: false,
})

export default VectorModelMapping;