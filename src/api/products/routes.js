const ProductsHandler = require('./handler');
const ProductsService = require('../../services/postgres/ProductsService');
const InventoryService = require('../../services/postgres/InventoryService');
const ProductValidator = require('../../validator/products');
const UsersService = require('../../services/postgres/UsersService');
const AuthHandler = require('../auth/handler');
const TokenManager = require('../../tokenize/TokenManager');
const AuthValidator = require('../../validator/auth');
const multer = require('multer');
const { storage, filter, maxSize } = require('../../utils');

module.exports = app => {
    var router = require('express').Router();
    const usersService = new UsersService();
    const inventoryService = new InventoryService();
    const productsService = new ProductsService();
    const productsHandler = new ProductsHandler(productsService, ProductValidator, inventoryService);
    const authHandler = new AuthHandler(usersService, TokenManager, AuthValidator);

    const upload = multer({ 
        storage: storage('./public/uploads/products', 'product'),
        fileFilter: filter,
        limits: { fileSize: maxSize }
    });
    
    router.post('/', [authHandler.verifyTokenHandler, authHandler.isAdminHandler], upload.single('photo_product'), productsHandler.postProductHandler);
    router.get('/', [authHandler.verifyTokenHandler, authHandler.isAdminHandler, authHandler.isCashierHandler], productsHandler.getProductHandler);
    router.put('/:id', [authHandler.verifyTokenHandler, authHandler.isAdminHandler], upload.single('photo_product'), productsHandler.putProductHandler);
    router.delete('/:id', [authHandler.verifyTokenHandler, authHandler.isAdminHandler], productsHandler.deleteProductHandler);

    app.use('/v1/products', router);

    /**
     * @openapi
     * tags:
     *  - name: Products
     *    description: The Products management endpoint
     * /v1/products/:
     *   post:
     *    security:
     *     - Authorization: []
     *    summary: Create Products
     *    tags: [Products]
     *    requestBody:
     *     required: true
     *     content:
     *      multipart/form-data:
     *       schema:
     *           $ref: '#/components/schemas/CreateProductInput'
     *    responses:
     *      201:
     *        description: Product Created
     *        content:
     *          application/json:
     *           schema:
     *            $ref: '#/components/schemas/CreateProductResponse'
     *      403:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/UnauthorizedResponse'
     *      401:
     *         description: Bad request
     *         content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/ForbiddenResponse'
     *      500:
     *        description: Internal Server Error
     *        content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/InternalServerResponse'
     *   get:
     *    security:
     *     - Authorization: []
     *    summary: Get Products set by Params can All, Search, By Id, Sort, Order Filter, and Pagination
     *    tags: [Products]
     *    parameters: 
     *     - in: query
     *       name: params
     *       schema: 
     *         type: string
     *         default: {"id": null,"filter": null,"search":null,"sort":null,"limit": 10,"page": 1}
     *       allowReserved: true
     *       description: parameters request
     *       required: true
     *    responses:
     *      200:
     *        description: Product Created
     *        content:
     *          application/json:
     *           schema:
     *            $ref: '#/components/schemas/GetProductResponse'
     *      403:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/UnauthorizedResponse'
     *      401:
     *         description: Bad request
     *         content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/ForbiddenResponse'
     *      500:
     *        description: Internal Server Error
     *        content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/InternalServerResponse'
     * /v1/products/{id}/:
     *   put:
     *    security:
     *     - Authorization: []
     *    summary: Edit Products
     *    tags: [Products]
     *    parameters:
     *     - in: path
     *       name: id
     *       schema:
     *         type: integer
     *       required: true
     *    requestBody:
     *     required: true
     *     content:
     *      multipart/form-data:
     *       schema:
     *           $ref: '#/components/schemas/CreateProductInput'
     *    responses:
     *      201:
     *        description: Product Edited
     *        content:
     *          application/json:
     *           schema:
     *            $ref: '#/components/schemas/EditProductResponse'
     *      403:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/UnauthorizedResponse'
     *      401:
     *         description: Bad request
     *         content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/ForbiddenResponse'
     *      500:
     *        description: Internal Server Error
     *        content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/InternalServerResponse'
     *   delete:
     *    security:
     *     - Authorization: []
     *    summary: Delete Products
     *    tags: [Products]
     *    parameters:
     *     - in: path
     *       name: id
     *       schema:
     *         type: integer
     *       required: true
     *    responses:
     *      201:
     *        description: Product Deleted
     *        content:
     *          application/json:
     *           schema:
     *            $ref: '#/components/schemas/RemoveProductResponse'
     *      403:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/UnauthorizedResponse'
     *      401:
     *         description: Bad request
     *         content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/ForbiddenResponse'
     *      500:
     *        description: Internal Server Error
     *        content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/InternalServerResponse'
     */
}