const AuthHandler = require('./handler');
const UsersService = require('../../services/postgres/UsersService');
const AuthValidator = require('../../validator/auth');
const TokenManager = require('../../tokenize/TokenManager');
   
module.exports = app => {
    var router = require('express').Router();
    const usersService = new UsersService();

    const authHandler = new AuthHandler(usersService, TokenManager, AuthValidator);

    /**
     * @openapi
     * tags:
     *   name: Auth
     *   description: The auth jwt token API
     * /v1/auth/:
     *   post:
     *     summary: Generate jwt token
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *            $ref: '#/components/schemas/AuthInput'
     *     responses:
     *       200:
     *         description: Generated jwt token.
     *         content:
     *           application/json:
     *            schema:
     *             $ref: '#/components/schemas/AuthResponse'
     *       401:
     *          description: Unauthorized
     *          content:
     *            application/json:
     *             schema:
     *               $ref: '#/components/schemas/UnauthorizedResponse'
     *       403:
     *          description: Forbidden
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
    router.post('/', authHandler.postAuthHandler);

    app.use('/v1/auth', router);
}