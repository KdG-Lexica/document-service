import { body, param, query } from "express-validator";

const GetDocumentsValidationRules = () => {
  return [
    body('filter').isArray(),
    param('model').isNumeric(),
    query('limit').isNumeric(),
  ];
};

export default GetDocumentsValidationRules;
