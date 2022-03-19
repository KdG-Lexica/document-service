import { sql } from '../db';

import { DataTypes, Model, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyCountAssociationsMixin } from 'sequelize';


export enum TASK_STATE {
  RUNNING = "RUNNING",
  ERROR = "ERROR",
  FINISHED = "FINISHED"
}

export interface IndexTaskAttributes {
  id?: number,
  VectorModelId: number,
  recordCount: number,
  recordsInserted: number,
  state: TASK_STATE,
}

class IndexTask extends Model<IndexTaskAttributes> implements IndexTaskAttributes {
  declare id: number;
  declare VectorModelId: number;
  declare recordCount: number;
  declare recordsInserted: number;
  declare documentCount: number;
  declare description: string;
  declare state: TASK_STATE;
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
  state: {
    type: DataTypes.ENUM(...Object.values(TASK_STATE)),
    defaultValue: TASK_STATE.RUNNING
  },
}, {
  sequelize: sql,
})

export default IndexTask;