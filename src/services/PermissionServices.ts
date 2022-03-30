import ModelSessionPermisson from "../models/ModelSessionPermission"
import VectorModel from "../models/VectorModel";

import bcrypt from 'bcrypt';


export const getAllowedModelsForSession = (session: string) => {
  return ModelSessionPermisson.findAll({
    where: {
      sessionKey: session,
    },
  })
}

export const checkAuthentication = async (modelId: number, password: string) => {
  const model = await VectorModel.findByPk(modelId);


  if(!model) throw new Error('error/model-not-found')
  if(!model.hash) return true;

  const authSuccess = await bcrypt.compare(password, model.hash);

  return authSuccess;
}

export const createPermissionForSession = async (modelId: number, session: string) => {
  return ModelSessionPermisson.create({
    VectorModelId: modelId,
    sessionKey: session
  })
}