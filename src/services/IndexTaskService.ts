import IndexTask, { IndexTaskAttributes, TASK_STATE } from "../models/IndexTask"

export const createIndexTask = (attributes: IndexTaskAttributes) => {
  return IndexTask.create(attributes)
}

export const getIndexTask = (taskId: number) => {
  return IndexTask.findByPk(taskId);
}

export const getIndexTasks = () => {
  return IndexTask.findAll();
}

export const cancelIndexTask = async (taskId: number) => {
  const task = await IndexTask.findByPk(taskId);
  if (!task) throw 'error/index-task-not-found'

  await task.update({ state: TASK_STATE.CANCELED })
}