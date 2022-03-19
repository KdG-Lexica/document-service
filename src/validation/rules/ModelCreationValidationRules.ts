import { body, param } from "express-validator";

const ModelCreationValidationRules = () => {
  return [
    body('mongoCollection.collection').isLength({ min: 1 }),
    body('mongoCollection.db').isLength({ min: 1 }),
    body('mongoCollection.host').isLength({ min: 1 }),
    body('mongoCollection.port').isNumeric(),
    body('mongoCollection.username').isLength({ min: 1 }),
    body('mongoCollection.password').isLength({ min: 1 }),
    body('meta').isArray(),
    body('mappings.id').isLength({ min: 1 }),
    body('mappings.name').isLength({ min: 1 }),
    body('mappings.vector3').isLength({ min: 1 }),
    body('cosineArray').isLength({ min: 1 }),
  ];
};

export default ModelCreationValidationRules;
