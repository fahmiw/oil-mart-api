const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
    constructor(){
        this._pool = new Pool();
    }

    async addUser({ username, password, fullname, role}) {
        await this.verifyNewUsername(username);

        const id = `user-${nanoid(10)}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, username, fullname, hashedPassword, role],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Failed add user');
        }
        return result.rows[0].id;

    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username]
        }

        const result = await this._pool.query(query);

        if (result.rows.length > 0) {
            throw new InvariantError('Failed add user. Username has used')
        }
    }

    async verifyUserCredential(username, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username]
        }
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new AuthenticationError('Wrong credential');
        }

        const { id, password: hashedPassword } = result.rows[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthenticationError('Wrong credential');
        }
        return id;
    }

    async verifyRole(id) {
        const query = {
            text: 'SELECT u.role_id, r.name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = $1',
            values: [id]
        }
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new AuthenticationError('Wrong credential');
        }
        return result.rows[0];
    }
    
    async searchUser(params) {
        let query = [];
        if(params === undefined) {
            /** GET ALL USER */
            query = {
                text: 'SELECT u.id, u.fullname, u.username, r.name FROM users u LEFT JOIN roles r ON u.role_id = r.id'
            };
        } else {
            if(params.sort === null) {
                if(params.id === null) {
                    if(params.search === null){
                        if(params.filter === null){
                            query = {
                                text: 'SELECT u.id, u.fullname, u.username, r.name FROM users u LEFT JOIN roles r ON u.role_id = r.id'
                            };
                        } else {
                            query = {
                                text: 'SELECT u.id, u.fullname, u.username, r.name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.role_id = $1',
                                values: [params.filter.id_role]
                            };
                        }
                    } else {
                        /** SEARCH USER with NAME */
                        query = {
                            text: 'SELECT u.id, u.fullname, u.username, r.name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.fullname LIKE $1',
                            values: ['%' + params.search.name + '%']
                        };
                    }
                } else {
                    /** GET USER BY ID */
                    query = {
                        text: 'SELECT u.id, u.fullname, u.username, r.name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = $1',
                        values: [params.id]
                    };
                }
            } else {
                /** GET ALL USER WITH SORT */
                query = {
                    text: 'SELECT u.id, u.fullname, u.username, r.name FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY $1 $2',
                    values: [params.sort.column, params.sort.type]
                };
            }
        }
        const result = await this._pool.query(query);
        return result.rows;
    }

    async editUser(id, { username, password, fullname, role}) {
        let query = [];
        const updatedAt = new Date().toISOString();

        if(password === undefined){
            query = {
                text: 'UPDATE users SET username = $1, fullname = $2, role_id = $3, updated_at = $4 WHERE id = $5',
                values: [username, fullname, role, updatedAt, id]
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = {
                text: 'UPDATE users SET username = $1, password = $2, fullname = $3, role_id = $4, updated_at = $5 WHERE id = $6',
                values: [username, hashedPassword, fullname, role, updatedAt, id]
            }
        }

        const result = await this._pool.query(query);
        if (result.rowCount !== 1) {
            throw new NotFoundError('Failed updated data, Id Not Found');
        }
        return result.rowCount;
    }

    async removeUser(id) {
        const query = {
            text: 'DELETE FROM users WHERE id = $1 RETURNING id',
            values: [id]
        }
        const result = await this._pool.query(query);
        if (result.rowCount !== 1) {
            throw new NotFoundError('Failed updated data, Id Not Found');
        }
        return result.rowCount;
    }

    async roleList() {
        const query = {
            text: 'SELECT * from roles'
        }
        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = UsersService;