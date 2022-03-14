import { db } from '../db';

import { DataTypes, Model, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyAddAssociationsMixin, NonAttribute } from 'sequelize';
import IPTCMeta from './IPTCMeta';

export interface IPTCSetAttributes {
  id?: number,
  name: string,
}

class IPTCSet extends Model<IPTCSetAttributes> implements IPTCSetAttributes {
  declare id: number;
  declare name: string;

  public static associations: {
    meta: Association<IPTCSet, IPTCMeta>;
  };

  declare getMeta: HasManyGetAssociationsMixin<IPTCMeta>;
  declare addMeta: HasManyAddAssociationsMixin<IPTCMeta, number>;

  declare IPTCMeta?: NonAttribute<IPTCMeta[]>
}

IPTCSet.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  }
}, {
  sequelize: db,
})

export default IPTCSet;