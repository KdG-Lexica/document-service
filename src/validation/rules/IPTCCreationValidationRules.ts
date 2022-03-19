import { body } from "express-validator";

const IPTCCreationValidationRules = () => {
  return [
    body('mongoCollection.collection').isLength({ min: 1 }),
    body('mongoCollection.db').isLength({ min: 1 }),
    body('mongoCollection.host').isLength({ min: 1 }),
    body('mongoCollection.port').isNumeric(),
    body('mongoCollection.username').isLength({ min: 1 }),
    body('mongoCollection.password').isLength({ min: 1 }),
    body('name').isLength({ min: 1 }),
  ];
};

export default IPTCCreationValidationRules;
