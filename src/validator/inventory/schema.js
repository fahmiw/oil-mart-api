const Joi = require('joi');

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateInventoryInput:
 *    type: object
 *    required: 
 *      - name
 *      - type
 *      - photo
 *    properties: 
 *      name:
 *       type: string
 *       default: Motul
 *      type:
 *       type: string
 *       default: Brand
 *      photo:
 *       type: string
 *       format: binary
 *   CreateInventoryResponse:
 *    type: object
 *    properties:
 *     message:
 *      type: string
 *      example: Inventory Created
 *     data:
 *      type: object
 *      properties:
 *       id:
 *        type: string
 *        example: user-VaSrC5K9BT
 *       name:
 *        type: string
 *        example: Shell
 *       type:
 *        type: string
 *        example: Brand
 *       photo:
 *        type: string
 *        example: inventory-95607436.jpg
 *   GetInventoryResponse:
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
 *      example: [{"id":2,"name":"Motor","type":"category","photo":"http://localhost:3000/static/uploads/inventory/inventory-101063818.jpg"},{"id":1,"name":"Mobil","type":"category","photo":"http://localhost:3000/static/uploads/inventory/inventory-933370930.jpg"},{"id":4,"name":"Motul","type":"brand","photo":"http://localhost:3000/static/uploads/inventory/inventory-772532765.jpg"}]
 *   EditInventoryResponse:
 *    type: object
 *    properties:
 *      message: 
 *       type: string
 *       example: Inventory (id) Updated
 *   RemoveInventoryResponse:
 *    type: object
 *    properties:
 *      message:  
 *       type: string
 *       example: Inventory (id) Deleted
 */

const InventoryPayloadSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
});

module.exports = { InventoryPayloadSchema }