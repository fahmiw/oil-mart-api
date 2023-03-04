/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('inventory', {
        id: 'id',
        name: {
            type: 'VARCHAR(20)',
            notNull: true
        },
        type: {
            type: 'VARCHAR(20)',
            notNull: true
        },
        photo: {
            type: 'VARCHAR',
            notNull: true
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }, 
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    }
    )
};

exports.down = pgm => {
    pgm.dropTable('inventory');
};
