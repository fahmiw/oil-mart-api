const {
    PostAuthPayloadSchema
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');
   
  const AuthValidator = {
    validatePostAuthPayload: (payload) => {
      const validationResult = PostAuthPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    }
  };
   
  module.exports = AuthValidator;