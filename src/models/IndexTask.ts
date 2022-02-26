import { db } from '../db';

import { DataTypes, Model, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyCountAssociationsMixin } from 'sequelize';


export interface IndexTaskAttributes {
  id?: number,
  VectorModelId: number,
  recordCount: number,
  recordsInserted: number,
  estimatedComplete: Date
}

class IndexTask extends Model<IndexTaskAttributes> implements IndexTaskAttributes {
  declare id: number;
  declare VectorModelId: number;
  declare recordCount: number;
  declare recordsInserted: number;
  declare estimatedComplete: Date;
}

IndexTask.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  VectorModelId: {
    type: DataTypes.INTEGER
  },
  recordCount: {
    type: DataTypes.INTEGER,
  },
  recordsInserted: {
    type: DataTypes.INTEGER,
  },
  estimatedComplete: {
    type: DataTypes.DATE,
  }
}, {
  sequelize: db,
})

export default IndexTask;