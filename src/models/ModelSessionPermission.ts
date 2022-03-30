import { sql } from '../db';

import { DataTypes, Model, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyCountAssociationsMixin } from 'sequelize';

export interface ModelSessionPermissionAttributes {
  id?: number,
  VectorModelId: number;
  sessionKey: string;
}

class ModelSessionPermisson extends Model<ModelSessionPermissionAttributes> implements ModelSessionPermissionAttributes {
  declare id: number;
  declare VectorModelId: number;
  declare sessionKey: string;
}

ModelSessionPermisson.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  VectorModelId: {
    type: DataTypes.INTEGER
  },
  sessionKey: {
    type: DataTypes.STRING,
  },
}, {
  sequelize: sql,
})

export default ModelSessionPermisson;