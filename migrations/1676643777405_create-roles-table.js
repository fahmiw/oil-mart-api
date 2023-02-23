/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('roles', {
        id : 'id',
        name : {
            type: 'VARCHAR(20)',
            notNull: true
        }
    });
    pgm.addConstraint('users', 'fk_users.role_id_roles_id', 'FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('users', 'fk_users.role_id_roles_id');
    pgm.dropTable('roles');
};
