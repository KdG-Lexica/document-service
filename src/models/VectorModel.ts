import { sql } from '../db';

import { DataTypes, Model, Association, HasManyAddAssociationsMixin, NonAttribute, HasManyGetAssociationsMixin } from 'sequelize';
import VectorModelMeta from './VectorModelMeta';
import VectorModelMapping from './VectorModelMapping';


export interface VectorModelAttributes {
  id: number,
  collectionName: string,
  cosineArray: string,
  description: string,
  documentCount: number,
  center$x: number,
  center$y: number,
  center$z: number,
}


class VectorModel extends Model<VectorModelAttributes> implements VectorModelAttributes {
  public id: number;
  public collectionName: string;
  declare cosineArray: string;
  declare description: string;
  declare documentCount: number;
  declare center$x: number;
  declare center$y: number;
  declare center$z: number;

  public static associations: {
    meta: Association<VectorModel, VectorModelMeta>;
    mappings: Association<VectorModel, VectorModelMapping>;
  };

  declare addMappings: HasManyAddAssociationsMixin<VectorModelMapping, number>;
  declare addMeta: HasManyAddAssociationsMixin<VectorModelMeta, number>;

  declare getMappings: HasManyGetAssociationsMixin<VectorModelMapping>;
  declare getMeta: HasManyGetAssociationsMixin<VectorModelMeta>;

  declare meta?: NonAttribute<VectorModelMeta[]>
  declare mappings?: NonAttribute<VectorModelMapping[]>
}

VectorModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  collectionName: {
    type: DataTypes.STRING,
  },
  cosineArray: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  documentCount: {
    type: DataTypes.INTEGER,
  },
  center$x: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  center$y: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  center$z: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  }
}, {
    sequelize: sql
})

export default VectorModel;