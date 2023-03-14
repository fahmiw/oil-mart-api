const Joi = require('joi');

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateUserInput:
 *    type: object
 *    required: 
 *     - username
 *     - fullname
 *     - password
 *     - role
 *    properties:
 *     username:
 *      type: string
 *      default: cashier1
 *     fullname:
 *      type: string
 *      default: cashier one
 *     password:
 *      type: string
 *      default: qwerty123
 *     role:
 *      type: integer
 *      default: 2
 *   CreateUserResponse:
 *    type: object
 *    properties:
 *     message:
 *      type: string
 *      example: User (fullname) Created
 *     data:
 *      type: object
 *      properties:
 *       id:
 *        type: string
 *        example: user-VaSrC5K9BT
 *       fullname:
 *        type: string
 *        example: User Test
 *       username:
 *        type: string
 *        example: usertest1
 *       role:
 *        type: string
 *        example: KASIR
 *   GetUserResponse:
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
 *      example: [{"id": "user-UfR7-KDKn1","name": "Admin","username": "adminoli","role": "ADMIN"},{"id": "user-Tlp4_xXeK9","name": "Fahmi Widianto","username": "fahmi11","role": "ADMIN"},{"id": "user-VaSrC5K9BT","name": "User Test","username": "usertest1","role": "KASIR"}]    
 *          
 */
const UserPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    fullname: Joi.string().required(),
    role: Joi.number().required()
});

module.exports = { UserPayloadSchema };