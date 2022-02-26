import IndexTask, { IndexTaskAttributes } from "../models/IndexTask"

export const createIndexTask = (attributes: IndexTaskAttributes) => {
  return IndexTask.create(attributes)
}

export const getIndexTast = (taskId: number) => {
  return IndexTask.findByPk(taskId);
}