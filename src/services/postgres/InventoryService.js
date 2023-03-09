const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class InventoryService {
    constructor(){
        this._pool = new Pool();
    }    

    async addInventory({name, type, file}) {
        const query = {
            text: 'INSERT INTO inventory(name, type, photo) VALUES($1, $2, $3) RETURNING id',
            values: [name, type, file]
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Failed add inventory');
        }
        return result.rows[0].id;
    }

    async readInventory(params) {
        let query = [];
        if(params === undefined) {
            query = {
                text: 'SELECT id, name, type, photo FROM inventory'
            };
        } else {
            if(params.search === null){
                if(params.id === null) {
                    query = {
                        text: 'SELECT id, name, type, photo FROM inventory'
                    };
                } else {
                    query = {
                        text: 'SELECT id, name, type, photo FROM inventory WHERE id = $1',
                        values: [params.id]
                    };
                }
            } else {
                query = {
                    text: 'SELECT id, name, type, photo FROM inventory WHERE name LIKE $1',
                    values: ['%' + params.search.name + '%']
                };
            }
        }
        const result = await this._pool.query(query);
        return result.rows;
    }

    async editInventory(id, columns) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: `UPDATE inventory SET${columns}, updated_at = $1 WHERE id = $2`,
            values: [updatedAt, id]
        }

        const result = await this._pool.query(query);
        if (result.rowCount !== 1) {
            throw new NotFoundError('Failed updated data, Id Not Found');
        }
        return result.rowCount;
    }

    async removeInventory(id) {
        const query = {
            text: 'DELETE FROM inventory WHERE id = $1 RETURNING id',
            values: [id]
        }
        const result = await this._pool.query(query);
        if (result.rowCount !== 1) {
            throw new NotFoundError('Failed updated data, Id Not Found');
        }
        return result.rowCount;
    }

}

module.exports = InventoryService;