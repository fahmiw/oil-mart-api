const Jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
    generateAccessToken: (payload) => Jwt.sign(payload, process.env.ACCESS_TOKEN_KEY),
    verifyAccessToken: (accessToken) => {
        try {
            const artifact = Jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
            return artifact; 
        } catch (error) {
            console.log(error);
            throw new InvariantError(`You don't have permission to access!`);
        }
    }
};
 
module.exports = TokenManager;