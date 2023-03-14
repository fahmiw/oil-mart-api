const UsersHandler = require('./handler');
const UsersService = require('../../services/postgres/UsersService');
const UserValidator = require('../../validator/users');
const AuthHandler = require('../auth/handler');
const TokenManager = require('../../tokenize/TokenManager');
const AuthValidator = require('../../validator/auth');

module.exports = app => {
    var router = require('express').Router();
    const usersService = new UsersService();

    const userHandlers = new UsersHandler(usersService, UserValidator);
    const authHandler = new AuthHandler(usersService, TokenManager, AuthValidator);
    
    router.post('/', [authHandler.verifyTokenHandler, authHandler.isAdminHandler], userHandlers.postUserHandler);
    router.get('/', [authHandler.verifyTokenHandler], userHandlers.getUserHandler);
    router.put('/:id', userHandlers.putUserHandler);
    router.delete('/:id', userHandlers.deleteUserHandler);
    router.get('/roles', userHandlers.getUserRoleHandler);

    app.use('/v1/users', router);

    /**
     * @openapi
     * tags:
     *   name: Users
     *   description: The user management API
     * /v1/users/:
     *   post:
     *     security:
     *      - Authorization: []
     *     summary: Create/Add User Account 
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *            $ref: '#/components/schemas/CreateUserInput'
     *     responses:
     *       200:
     *         description: Succes created user
     *         content:
     *           application/json:
     *            schema:
     *             $ref: '#/components/schemas/CreateUserResponse'
     *       401:
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
     *   get:
     *     security:
     *      - Authorization: []
     *     summary: Get Users set by Params can All, Search, By Id, Sort, Order Filter, and Pagination
     *     tags: [Users]
     *     parameters: 
     *      - in: query
     *        name: params
     *        schema: 
     *          type: string
     *          default: {"id": null,"filter":null,"search":null,"sort":null,"limit": 10,"page": 1}
     *        allowReserved: true
     *        description: parameters request
     *     responses:
     *       200:
     *          description: Success get data
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/GetUserResponse'
     *       401:
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
     *        
     */
};