import IndexTask, { IndexTaskAttributes } from "../models/IndexTask"

export const createIndexTask = (attributes: IndexTaskAttributes) => {
  return IndexTask.create(attributes)
}

export const getIndexTask = (taskId: number) => {
  return IndexTask.findByPk(taskId);
}

export const getIndexTasks = () => {
  return IndexTask.findAll();
}