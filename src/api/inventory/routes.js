const InventoryHandler = require('./handler');
const InventoryService = require('../../services/postgres/InventoryService');
const InventoryValidator = require('../../validator/inventory');
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
    const inventoryHandler = new InventoryHandler(inventoryService, InventoryValidator);
    const authHandler = new AuthHandler(usersService, TokenManager, AuthValidator);
    
    const upload = multer({ 
        storage: storage('./public/uploads/inventory', 'inventory'),
        fileFilter: filter,
        limits: { fileSize: maxSize }
    });
    
    router.post('/', [authHandler.verifyTokenHandler, authHandler.isAdminHandler], upload.single('photo'), inventoryHandler.postInventoryHandler);
    router.get('/', [authHandler.verifyTokenHandler, authHandler.isAdminHandler, authHandler.isCashierHandler], inventoryHandler.getInventoryHandler);
    router.put('/:id', [authHandler.verifyTokenHandler, authHandler.isAdminHandler], upload.single('photo'), inventoryHandler.putInventoryHandler);
    router.delete('/:id', [authHandler.verifyTokenHandler, authHandler.isAdminHandler], inventoryHandler.deleteInventoryHandler);

    app.use('/v1/inventory', router);

    /**
     * @openapi
     * tags:
     *  - name: Inventory
     *    description: The Inventory management endpoint
     * /v1/inventory/:
     *   post:
     *     security:
     *      - Authorization: []
     *     summary: Create Category or Brand
     *     tags: [Inventory]
     *     requestBody:
     *      required: true
     *      content:
     *       multipart/form-data:
     *        schema:
     *            $ref: '#/components/schemas/CreateInventoryInput'
     *     responses:
     *       201:
     *         description: Inventory Created
     *         content:
     *           application/json:
     *            schema:
     *             $ref: '#/components/schemas/CreateInventoryResponse'
     *       403:
     *          description: Unauthorized
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/UnauthorizedResponse'
     *       401:
     *          description: Bad request
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/ForbiddenResponse'
     *       500:
     *         description: Internal Server Error
     *         content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/InternalServerResponse'
     *   get:
     *     security:
     *      - Authorization: []
     *     summary: Get Inventory set by Params can All, Search, By Id, Sort, Order Filter, and Pagination
     *     tags: [Inventory]
     *     parameters: 
     *      - in: query
     *        name: params
     *        schema: 
     *          type: string
     *          default: {"id": null,"search":null,"limit": 10,"page": 1}
     *        allowReserved: true
     *        description: parameters request
     *        required: true
     *     responses:
     *       200:
     *          description: Success get data
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/GetInventoryResponse'
     *       403:
     *          description: Unauthorized
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/UnauthorizedResponse'
     *       400:
     *          description: Bad request
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/ForbiddenResponse'
     *       500:
     *         description: Internal Server Error
     *         content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/InternalServerResponse'
     * /v1/inventory/{id}/:
     *   put:
     *     security:
     *      - Authorization: []
     *     summary: Edit Category or Brand
     *     tags: [Inventory]
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        required: true
     *     requestBody:
     *      required: true
     *      content:
     *       multipart/form-data:
     *        schema:
     *            $ref: '#/components/schemas/CreateInventoryInput'
     *     responses:
     *       200:
     *         description: Inventory Created
     *         content:
     *           application/json:
     *            schema:
     *             $ref: '#/components/schemas/EditInventoryResponse'
     *       403:
     *          description: Unauthorized
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/UnauthorizedResponse'
     *       400:
     *          description: Bad request
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/ForbiddenResponse'
     *       500:
     *         description: Internal Server Error
     *         content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/InternalServerResponse'
     *   delete:
     *     security:
     *      - Authorization: []
     *     summary: Delete Category or Brand
     *     tags: [Inventory]
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        required: true
     *     responses:
     *       200:
     *         description: Inventory Created
     *         content:
     *           application/json:
     *            schema:
     *             $ref: '#/components/schemas/RemoveInventoryResponse'
     *       403:
     *          description: Unauthorized
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/UnauthorizedResponse'
     *       400:
     *          description: Bad request
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/ForbiddenResponse'
     *       500:
     *         description: Internal Server Error
     *         content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/InternalServerResponse'
     */
}