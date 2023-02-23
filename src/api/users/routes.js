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
    router.get('/', userHandlers.getUserHandler);
    router.put('/:id', userHandlers.putUserHandler);
    router.delete('/:id', userHandlers.deleteUserHandler);
    router.get('/roles', userHandlers.getUserRoleHandler);

    app.use('/v1/users', router);
};