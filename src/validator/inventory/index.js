const InvariantError = require('../../exceptions/InvariantError');
const { InventoryPayloadSchema } = require('./schema');

const InventoryValidator = {
    validateInventoryPayload: (payload) => {
        const validationResult = InventoryPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = InventoryValidator;