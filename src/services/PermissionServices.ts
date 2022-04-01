import ModelSessionPermisson from "../models/ModelSessionPermission"
import VectorModel from "../models/VectorModel";

import bcrypt from 'bcrypt';



// Get Models for allowed for this session 
export const getAllowedModelsForSession = (session: string) => {
  return ModelSessionPermisson.findAll({
    where: {
      sessionKey: session,
    },
  })
}


// Do password check
export const checkAuthentication = async (modelId: number, password: string) => {
  const model = await VectorModel.findByPk(modelId);


  if(!model) throw new Error('error/model-not-found')
  if(!model.hash) return true;

  const authSuccess = await bcrypt.compare(password, model.hash);

  return authSuccess;
}


// Add permssion for session
export const createPermissionForSession = async (modelId: number, session: string) => {
  return ModelSessionPermisson.create({
    VectorModelId: modelId,
    sessionKey: session
  })
}