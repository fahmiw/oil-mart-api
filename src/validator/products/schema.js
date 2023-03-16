const Joi = require('joi');

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateProductInput:
 *    type: object
 *    required: 
 *      - sku
 *      - name_item
 *      - photo_product
 *      - id_inventory
 *      - price
 *      - special_price
 *      - total_quantity
 *    properties: 
 *      sku:
 *       type: string
 *       default: MTL00001
 *      name_item:
 *       type: string
 *       default: Motul 10W4H
 *      photo_product:
 *       type: string
 *       format: binary
 *      id_inventory:
 *       type: array
 *       default: [1,2]
 *      price:
 *       type: string
 *       default: 200000
 *      special_price:
 *       type: string
 *       default: 0
 *      total_quantity:
 *       type: integer
 *       default: 200
 *   CreateProductResponse:
 *    type: object
 *    properties:
 *     message:
 *      type: string
 *      example: Product Created
 *     data:
 *      type: object
 *      properties:
 *       id:
 *        type: string
 *        example: 6 
 *       sku:
 *        type: string
 *        example: MTL00001
 *       name_item:
 *        type: string
 *        example: Motul 10W4H
 *       photo_product:
 *        type: string
 *        example: http://localhost:3000/static/uploads/products/product-96757755.jpg
 *       categorys:
 *        type: array
 *        example: ["Mobil"]
 *       brands:
 *        type: array
 *        example: ["Motul"]
 *       price:
 *        type: string
 *        example: 200000
 *       special_price:
 *        type: string
 *        example: 0
 *       total_quantity:
 *        type: integer
 *        example: 200
 *   GetProductResponse:
 *    type: object
 *    properties:
 *     previousPage:
 *      type: integer
 *      example: null
 *     nextPage:
 *      type: integer
 *      example: null
 *     total:
 *      type: integer
 *      example: 3
 *     totalPages:
 *      type: integer
 *      example: 1
 *     items:
 *      type: array
 *      example: [{"id":3,"sku":"MTL00001","name_item":"Motul 10W4","photo_product":"http://localhost:3000/static/uploads/products/product-88415308.jpg","category":["Mobil","Motor","Motor","Mobil"],"brand":["Motul","Motul","Motul"],"price":"120000","special_price":"0","total_quantity":50,"is_available":true},{"id":4,"sku":"SPX10001","name_item":"Honda SPX 1","photo_product":"http://localhost:3000/static/uploads/products/product-909900850.jpg","category":["Mobil","Motor","Motor","Mobil"],"brand":["Motul","Motul","Motul"],"price":"75000","special_price":"60000","total_quantity":0,"is_available":false},{"id":6,"sku":"Dele11","name_item":"Delete","photo_product":"http://localhost:3000/static/uploads/products/product-96757755.jpg","category":["Mobil","Motor","Motor","Mobil"],"brand":["Motul","Motul","Motul"],"price":"60000","special_price":"0","total_quantity":50,"is_available":true}]
 *   EditProductResponse:
 *    type: object
 *    properties:
 *      message: 
 *       type: string
 *       example: Product (id) Updated
 *   RemoveProductResponse:
 *    type: object
 *    properties:
 *      message:  
 *       type: string
 *       example: Product (id) Deleted
 */

const ProductPayloadSchema = Joi.object({
    sku: Joi.string(),
    name_item: Joi.string(),
    id_inventory: Joi.required(),
    price: Joi.number().required(),
    special_price: Joi.number(),
    total_quantity: Joi.number().required()
});

module.exports = { ProductPayloadSchema }