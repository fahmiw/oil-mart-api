const ClientError = require('../../exceptions/ClientError');
const { pagina, fullUrl} = require('../../utils');
var fs = require('fs');

class InventoryHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator

        this.postInventoryHandler = this.postInventoryHandler.bind(this);
        this.getInventoryHandler = this.getInventoryHandler.bind(this);
        this.putInventoryHandler = this.putInventoryHandler.bind(this);
        this.deleteInventoryHandler = this.deleteInventoryHandler.bind(this);
    }

    async postInventoryHandler(req, res) {
        try {
            this._validator.validateInventoryPayload(req.body);
            const { name, type } = req.body;

            if (req.file == undefined) {
                throw new ClientError("Please upload a file!");
            }
            const file = req.file.filename;

            const inventoryId = await this._service.addInventory({name, type, file});

            res.status(200).send({
                message: 'Inventory Created',
                data: {
                    id: inventoryId,
                    name: name,
                    type: type,
                    photo: file
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

    async getInventoryHandler(req, res) {
        try {
            if ( req.query.params === undefined) {
                throw new ClientError("Params undefined")
            }
            const objParams = JSON.parse(req.query.params);
            let host = fullUrl(req);

            let inventory = await this._service.readInventory(objParams);
            
            let result = inventory.map(function(a) {
                return {
                    id: a.id,
                    name: a.name,
                    type: a.type,
                    photo: host + "/static/uploads/inventory/" + a.photo
                }
            });

            const dataResult = pagina(result, parseInt(objParams.page), parseInt(objParams.limit));
            
            res.status(200).send(dataResult)
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

    async putInventoryHandler(req, res) {
        try {
            const { id } = req.params;
            const { name, type } = req.body;
            let columns = [];
            var photo;
            const inventory = await this._service.readInventory({id: id, search: null});
            if (inventory.length === 0) {
                fs.unlink('./public/uploads/inventory/' + req.file.filename, (err) => {
                    if (err) {
                        throw new ClientError('Id inventory not found');
                    }
                });
                throw new ClientError('Id inventory not found');
            }
            if (req.file !== undefined) {
                photo = req.file.filename;
            }
            if (name !== undefined) {
                columns.push(` name = '${name}'`);
            } 
            if (type !== undefined) {
                columns.push(` type = '${type}'`);
            }
            if (photo !== undefined) {
                fs.unlink('./public/uploads/inventory/' + inventory[0].photo, (err) => {
                    if (err) {
                        throw new ClientError('Failed delete lastest file');
                    }
                });
                columns.push(` photo = '${photo}'`);
            }

            if (columns === null || columns === '') {
                throw new ClientError('No one column updated');
            }

            await this._service.editInventory(id, columns.toString());
            res.status(200).send({
                message: `Inventory ${id} Updated`
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

    async deleteInventoryHandler(req, res) {
        try {
            const { id } = req.params;
            const inventory = await this._service.readInventory({id: id, search: null});
            if (inventory.length === 0) {
                throw new ClientError('Id inventory not found');
            }
            fs.unlink('./public/uploads/inventory/' + inventory[0].photo, (err) => {
                if (err) {
                    throw new ClientError('Failed delete lastest file');
                }
            });

            await this._service.removeInventory(id);
            res.status(200).send({
                message: `Inventory deleted`
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

module.exports = InventoryHandler;