import { sql } from '../db';

import { DataTypes, Model, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyCountAssociationsMixin } from 'sequelize';


export interface IPTCMetaAttributes {
  id?: number,
  IPTCSetId: number,
  vector$x: number,
  vector$y: number,
  vector$z: number,
  label: string,
  level: number,
}

class IPTCMeta extends Model<IPTCMetaAttributes> implements IPTCMetaAttributes {
  declare id: number;
  declare IPTCSetId: number;
  declare vector$x: number;
  declare vector$y: number;
  declare vector$z: number;
  declare label: string;
  declare level: number;
}

IPTCMeta.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  IPTCSetId: {
    type: DataTypes.INTEGER
  },
  vector$x: {
    type: DataTypes.DOUBLE,
  },
  vector$y: {
    type: DataTypes.DOUBLE,
  },
  vector$z: {
    type: DataTypes.DOUBLE,
  },
  label: {
    type: DataTypes.STRING,
  },
  level: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize: sql,
  getterMethods: {
    vector3(){
      return {
        x: this.vector$x,
        y: this.vector$y,
        z: this.vector$z
      }
    }
  }
})

export default IPTCMeta;