const Joi = require('joi');

const ProductPayloadSchema = Joi.object({
    sku: Joi.string(),
    name_item: Joi.string(),
    id_inventory: Joi.required(),
    price: Joi.number().required(),
    special_price: Joi.number(),
    total_quantity: Joi.number().required()
});

module.exports = { ProductPayloadSchema }