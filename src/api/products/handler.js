const ClientError = require('../../exceptions/ClientError');
const { pagina, fullUrl} = require('../../utils');
var fs = require('fs');

class ProductsHandler {
    constructor(service, validator, inventoryService) {
        this._service = service;
        this._validator = validator;
        this._inventoryService = inventoryService;

        this.postProductHandler = this.postProductHandler.bind(this);
        this.getProductHandler = this.getProductHandler.bind(this);
        this.putProductHandler = this.putProductHandler.bind(this);
        this.deleteProductHandler = this.deleteProductHandler.bind(this); 
    }

    async postProductHandler(req, res) {
        try {
            this._validator.validateProductPayload(req.body);
            const { sku, name_item, id_inventory, price, special_price, total_quantity} = req.body;
            var category = [], brand = [];

            let host = fullUrl(req);
            const jsonInventory = JSON.stringify(id_inventory);
            
            for(let i=0; i<id_inventory.length; i++) {
                var inventory = await this._inventoryService.readInventory({id: id_inventory[i], search: null})
                if(inventory[0].type === 'category') {
                    category.push(inventory[0].name);
                } else if (inventory[0].type === 'brand') {
                    brand.push(inventory[0].name);
                }
            }
            if (req.file == undefined) {
                throw new ClientError("Please upload a file!");
            }
            const file = req.file.filename;
            
            const productId = await this._service.addProduct({sku, name_item, file, jsonInventory, price, special_price, total_quantity});
            

            res.status(200).send({
                message: 'Product Created',
                data: {
                    id: productId,
                    sku: sku,
                    name: name_item,
                    photo_product: host + "/static/uploads/products/" + file,
                    categorys: category,
                    brands: brand,
                    price: price,
                    special_price: special_price,
                    total_quantity: total_quantity
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

    async getProductHandler(req, res) {
        try {
            var category = [], brand = [], result = [];
            let host = fullUrl(req);
            if ( req.query.params === undefined) {
                throw new ClientError("Params undefined")
            }
            const objParams = JSON.parse(req.query.params);
            let products = await this._service.searchProducts(objParams);

            for(let j=0; j<products.length; j++){
                for(let i=0; i<products[j].id_inventory.length; i++) {
                    var inventory = await this._inventoryService.readInventory({id: products[j].id_inventory[i], search: null});
                    if(inventory[0].type === 'category') {
                        category.push(inventory[0].name);
                    } else if (inventory[0].type === 'brand') {
                        brand.push(inventory[0].name);
                    }
                }
                result[j] = {
                    id: products[j].id,
                    sku: products[j].sku,
                    name_item: products[j].name_item,
                    photo_product: host + "/static/uploads/products/" + products[j].photo_product,
                    category: category,
                    brand: brand,
                    price: products[j].price,
                    special_price: products[j].special_price,
                    total_quantity: products[j].total_quantity,
                    is_available: products[j].is_available
                }
                category = [];
                brand = [];
            }
            
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

    async putProductHandler(req, res) {
        try {
            const { id } = req.params;
            const { sku, name_item, id_inventory, price, special_price, total_quantity } = req.body;
            var columns = [], photo;

            const product = await this._service.searchProducts({id: id, filter: null, search:null, sort:null});
            if (product.length === 0) {
                fs.unlink('./public/uploads/product/' + req.file.filename, (err) => {
                    if (err) {
                        throw new ClientError('Id product not found');
                    }
                });
                throw new ClientError('Id Product not found');
            }
            if (req.file !== undefined) {
                photo = req.file.filename;
            }
            if (sku !== undefined) {
                columns.push(` sku = '${sku}'`);
            }
            if (name_item !== undefined) {
                columns.push(` name_item = '${name_item}'`);
            } 
            if (id_inventory !== undefined) {
                const jsonInventory = JSON.stringify(id_inventory);
                columns.push(` id_inventory = '${jsonInventory}'`);
            }
            if (price !== undefined) {
                columns.push(` price = '${price}'`);
            }
            if (special_price !== undefined) {
                columns.push(` special_price = '${special_price}'`);
            }
            if (total_quantity !== undefined) {
                columns.push(` total_quantity = '${total_quantity}'`);

                const isAvailable = total_quantity == 0 ? false : true;
                columns.push(` is_available = '${isAvailable}'`);
            }
            if (photo !== undefined) {
                fs.unlink('./public/uploads/products/' + product[0].photo_product, (err) => {
                    if (err) {
                        throw new ClientError('Failed delete lastest file');
                    }
                });
                columns.push(` photo_product = '${photo}'`);
            }

            if (columns === null || columns === '') {
                throw new ClientError('No one column updated');
            }

            await this._service.editProduct(id, columns.toString());
            res.status(200).send({
                message: `Product ${id} Updated`
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

    async deleteProductHandler(req, res) {
        try {
            const { id } = req.params;
            const product = await this._service.searchProducts({id: id, filter: null, search:null, sort:null});
            if (product.length === 0) {
                throw new ClientError('Id product not found');
            }
            fs.unlink('./public/uploads/products/' + product[0].photo_product, (err) => {
                if (err) {
                    throw new ClientError('Failed delete lastest file');
                }
            });

            await this._service.removeProduct(id);
            res.status(200).send({
                message: `Product deleted`
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

module.exports = ProductsHandler;