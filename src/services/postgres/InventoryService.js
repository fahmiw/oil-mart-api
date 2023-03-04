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

}

module.exports = InventoryService;