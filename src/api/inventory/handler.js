const ClientError = require('../../exceptions/ClientError');

class InventoryHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator

        this.postInventoryHandler = this.postInventoryHandler.bind(this);
    }
    async postInventoryHandler(req, res) {
        try {
            this._validator.validateInventoryPayload(req.body);
            const { name, type } = req.body;
            if (req.file == undefined) {
                throw new Error("Please upload a file!");
            }
            const file = req.file.filename;
            const inventoryId = await this._service.addInventory({name, type, file});

            res.status(200).send({
                message: 'Inventory Created',
                data: {
                    id: inventoryId,
                    name: name,
                    type: type
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
}

module.exports = InventoryHandler;