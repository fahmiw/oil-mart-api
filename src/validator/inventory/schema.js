const Joi = require('joi');

const InventoryPayloadSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
});

module.exports = { InventoryPayloadSchema }