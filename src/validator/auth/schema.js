const Joi = require('joi');
/**
 * @openapi
 * components:
 *  schemas:
 *   AuthInput:
 *    type: object
 *    required: 
 *     - username
 *     - password
 *    properties:
 *     username:
 *      type: string
 *      default: fahmi11
 *     password:
 *      type: string
 *      default: qwerty123
 *   AuthResponse:
 *    type: object
 *    properties:
 *     message:
 *      type: string
 *      example: Token generated
 *     data:
 *      type: object
 *      properties:
 *       accessToken:
 *        type: string
 *        example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItVGxwNF94WGVLOSIsImlhdCI6MTY3ODgwMzA2Nn0._Yt2Ut61d8aZoKQBO04TVa8m6HPJVGfr32K-F_WdPdA
 *   UnauthorizedResponse:
 *    type: object
 *    properties:
 *     message:
 *      example: Wrong credential
 *   ForbiddenResponse:
 *    type: object
 *    properties:
 *     message:
 *      example: Require Admin/Cashier Credential
 *   InternalServerResponse:
 *    type: object
 *    properties:
 *     message:
 *      example: Sorry, have trouble in server / Please upload a file!
 */
const PostAuthPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
 
module.exports = {
  PostAuthPayloadSchema
};