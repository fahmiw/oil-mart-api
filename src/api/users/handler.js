const ClientError = require('../../exceptions/ClientError');
const { pagina } = require('../../utils');
const bcrypt = require('bcrypt');

class UsersHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
  
        this.postUserHandler = this.postUserHandler.bind(this);
        this.getUserHandler = this.getUserHandler.bind(this);
        this.putUserHandler = this.putUserHandler.bind(this);
        this.deleteUserHandler = this.deleteUserHandler.bind(this);
        this.getUserRoleHandler = this.getUserRoleHandler.bind(this);
    }

    async postUserHandler(req, res) {
        try {
            this._validator.validateUserPayload(req.body);
            const { username, password, fullname, role } = req.body;

            const userId = await this._service.addUser({ username, password, fullname, role });
            res.status(200).send({
                message: `User ${username} Created`,
                data: {
                    id : userId,
                    fullname : fullname,
                    username : username,
                    role : role == 1 ? 'ADMIN' : 'KASIR'
                }
            });
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

    async getUserHandler(req, res) {
        try {
            if ( req.query.params === undefined) {
                throw new ClientError("Params undefined")
            }
            const objParams = JSON.parse(req.query.params);
            let users = await this._service.searchUser(objParams);
            
            let result = users.map(function(a) {
                return {
                    id: a.id,
                    name: a.fullname,
                    username: a.username,
                    role: a.name
                }
            });
            const dataResult = pagina(result, parseInt(objParams.page), parseInt(objParams.limit));

            res.status(200).send(dataResult);
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

    async putUserHandler(req, res) {
        try {
            const { username, password, fullname, role } = req.body;
            const { id } = req.params;
            let columns = [];

            if (username !== undefined) {
                const user = await this._service.searchUser({id: null,search: {username: username},sort:null});
                if (user.length > 0) {
                    throw new ClientError('username duplicate');
                }
                columns.push(` username = '${username}'`);
            } 
            if (password !== undefined) {
                const hashedPassword = await bcrypt.hash(password, 10);
                columns.push(` password = '${hashedPassword}'`);
            }
            if (fullname !== undefined) {
                columns.push(` fullname = '${fullname}'`);
            }
            if (role !== undefined) {
                columns.push(` role = '${role}'`);
            }

            await this._service.editUser(id, columns.toString());
            res.status(200).send({
                message: `User ${username} Updated`
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

    async deleteUserHandler(req, res) {
        try {
            const { id } = req.params;

            await this._service.removeUser(id);
            res.status(200).send({
                message: `User deleted`
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

    async getUserRoleHandler(req, res) {
        try {
            const result = await this._service.roleList();
            res.status(200).send({
                data: result
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
}

module.exports = UsersHandler;