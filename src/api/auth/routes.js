const AuthHandler = require('./handler');
const UsersService = require('../../services/postgres/UsersService');
const AuthValidator = require('../../validator/auth');
const TokenManager = require('../../tokenize/TokenManager');
   
module.exports = app => {
    var router = require('express').Router();
    const usersService = new UsersService();

    const authHandler = new AuthHandler(usersService, TokenManager, AuthValidator);

    router.post('/', authHandler.postAuthHandler);

    app.use('/v1/auth', router);
}