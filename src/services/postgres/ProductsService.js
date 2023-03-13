const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class ProductsService {
    constructor(){
        this._pool = new Pool();
    }

    async addProduct({sku, name_item, file, jsonInventory, price, special_price, total_quantity}) {
        const isAvailable = total_quantity == 0 ? false : true;
        const query = {
            text: 'INSERT INTO products(sku, name_item, photo_product, id_inventory, price, special_price, total_quantity, is_available) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: [sku, name_item, file, jsonInventory, price, special_price, total_quantity, isAvailable]
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Failed add inventory');
        }
        return result.rows[0].id;
    }

    async searchProducts(params) {
        let query = [];
        if(params === undefined) {
            /** GET ALL Product */
            query = {
                text: 'SELECT id, sku, name_item, photo_product, id_inventory, price, special_price, total_quantity, is_available FROM products'
            };
        } else {
            if(params.sort === null) {
                if(params.id === null) {
                    if(params.search === null){
                        if(params.filter === null){
                            query = {
                                text: 'SELECT id, sku, name_item, photo_product, id_inventory, price, special_price, total_quantity, is_available FROM products'
                            };
                        } else {
                            if(params.filter.id_category) {
                                query = {
                                    text: 'SELECT id, sku, name_item, photo_product, id_inventory, price, special_price, total_quantity, is_available FROM products WHERE id_category LIKE $1',
                                    values: ['%' + params.filter.id_category + '%']
                                }
                            } else if (params.filter.id_brand) {
                                query = {
                                    text: 'SELECT id, sku, name_item, photo_product, id_inventory, price, special_price, total_quantity, is_available FROM products WHERE id_category LIKE $1',
                                    values: ['%' + params.filter.id_brand + '%']
                                }
                            }
                        }
                    } else {
                        if (params.search.name) {
                            /** SEARCH PRODUCT with name */
                            query = {
                                text: 'SELECT id, sku, name_item, photo_product, id_inventory, price, special_price, total_quantity, is_available FROM products WHERE name_item = $1',
                                values: [params.search.name]
                            };
                        }
                    } 
                } else {
                    /** GET PRODUCT BY ID */
                    query = {
                        text: 'SELECT id, sku, name_item, photo_product, id_inventory, price, special_price, total_quantity, is_available FROM products WHERE id = $1',
                        values: [params.id]
                    };
                }
            } else {
                /** GET ALL PRODUCT WITH SORT */
                query = {
                    text: 'SELECT id, sku, name_item, photo_product, id_inventory, price, special_price, total_quantity, is_available FROM products ORDER BY $1 $2',
                    values: [params.sort.column, params.sort.type]
                };
            }
        }
        const result = await this._pool.query(query);
        return result.rows;
    }

    async editProduct(id, columns) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: `UPDATE products SET${columns}, updated_at = $1 WHERE id = $2`,
            values: [updatedAt, id]
        }

        const result = await this._pool.query(query);
        if (result.rowCount !== 1) {
            throw new NotFoundError('Failed updated data, Id Not Found');
        }
        return result.rowCount;
    }

    async removeProduct(id) {
        const query = {
            text: 'DELETE FROM products WHERE id = $1 RETURNING id',
            values: [id]
        }
        const result = await this._pool.query(query);
        if (result.rowCount !== 1) {
            throw new NotFoundError('Failed delete data, Id Not Found');
        }
        return result.rowCount;
    }
}

module.exports = ProductsService;