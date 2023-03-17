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
    router.put('/:id', [authHandler.verifyTokenHandler, authHandler.isAdminHandler], userHandlers.putUserHandler);
    router.delete('/:id', [authHandler.verifyTokenHandler, authHandler.isAdminHandler], userHandlers.deleteUserHandler);
    router.get('/roles', userHandlers.getUserRoleHandler);

    app.use('/v1/users', router);

    /**
     * @openapi
     * tags:
     *  - name: Users
     *    description: The user management endpoint
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
     *       201:
     *         description: Success created user
     *         content:
     *           application/json:
     *            schema:
     *             $ref: '#/components/schemas/CreateUserResponse'
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
     *        required: true
     *     responses:
     *       200:
     *          description: Success get data
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/GetUserResponse'
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
     * /v1/users/{id}/:
     *   put:
     *     security:
     *      - Authorization: []
     *     summary: Edit User Data
     *     tags: [Users]
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: string
     *        required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *            $ref: '#/components/schemas/CreateUserInput'
     *     responses:
     *       200:
     *         description: Success edit user
     *         content:
     *           application/json:
     *            schema:
     *             $ref: '#/components/schemas/EditUserResponse'
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
     *     summary: Delete Users Data
     *     tags: [Users]
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: string
     *        required: true
     *     responses:
     *       201:
     *         description: Success delete user
     *         content:
     *           application/json:
     *            schema:
     *             $ref: '#/components/schemas/RemoveUserResponse'
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
     * /v1/users/roles/:
     *   get:
     *     summary: Get All Roles Data
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: Success get Roles
     *         content:
     *           application/json:
     *            schema:
     *             $ref: '#/components/schemas/RoleListResponse'
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
     *        
     */
};