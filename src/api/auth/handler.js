const ClientError = require("../../exceptions/ClientError");

class AuthHandler {
    constructor(usersService, tokenManager, validator) {
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthHandler = this.postAuthHandler.bind(this);
        this.verifyTokenHandler = this.verifyTokenHandler.bind(this);
        this.isAdminHandler = this.isAdminHandler.bind(this);
        this.isCashierHandler = this.isCashierHandler.bind(this);
    }
    
    async postAuthHandler(req, res) {
        try {
            this._validator.validatePostAuthPayload(req.body);
 
            const { username, password } = req.body;
            const id = await this._usersService.verifyUserCredential(username, password);

            const accessToken = this._tokenManager.generateAccessToken({ id });
          
            res.status(200).send({
              message: 'Token generated',
              data: {
                accessToken,
                }
            });
            
        } catch (error) {
          if (error instanceof ClientError) {
            res.status(error.statusCode).send({
                message: error.message,
            });
          } else {
              console.error(error);
              res.status(500).send({
              message: 'Sorry, have trouble in server'
              });
          }
        }
    }

    async verifyTokenHandler(req, res, next) {
      try {
        let tokenHeader = req.headers.authorization;

        if(tokenHeader === undefined){
          throw new ClientError("Require Authorization Token", 403)
        }
      
        if (tokenHeader.split(' ')[0] !== 'Bearer') {
          return res.status(500).send({
            auth: false,
            message: "Error",
            errors: "Incorrect token format"
          });
        }
  
        let token = tokenHeader.split(' ')[1];
  
        if (!token) {
          return res.status(403).send({
            auth: false,
            message: "Error",
            errors: "No token provided"
          });
        }
  
        const decoded = this._tokenManager.verifyAccessToken(token);
        req.userId = decoded.id;
        next();

      } catch (error){
        if (error instanceof ClientError) {
            res.status(error.statusCode).send({
                message: error.message,
            });
        } else {
            console.error(error);
            res.status(500).send({
            message: 'Sorry, have trouble in server'
            });
        } 
      }
    }

    async isAdminHandler(req, res, next) {
      try {
          const role = await this._usersService.verifyRole(req.userId);
          if(role.name === "ADMIN"){
            next();
            return;
          } 
          res.status(403).send({
            message: 'Require Admin Credential'
          });
          return;
      } catch (error) {
          if (error instanceof ClientError) {
            res.status(error.statusCode).send({
                message: error.message,
            });
          } else {
              console.error(error);
              res.status(500).send({
              message: 'Sorry, have trouble in server'
              });
          } 
        }
    }

    async isCashierHandler(req, res, next) {
      try {
        const role = await this._usersService.verifyRole(req.userId);
        if(role.name === "KASIR"){
          next();
          return;
        } 
        res.status(403).send({
          message: 'Require Cashier Credential'
        });
        return;

      } catch (error) {
        if (error instanceof ClientError) {
          res.status(error.statusCode).send({
              message: error.message,
          });
        } else {
            console.error(error);
            res.status(500).send({
            message: 'Sorry, have trouble in server'
            });
        } 
      }
    }
}

module.exports = AuthHandler;