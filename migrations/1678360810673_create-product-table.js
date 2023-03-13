/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('products', {
        id: 'id',
        sku: {
            type: 'VARCHAR(15)'
        },
        name_item: {
            type: 'VARCHAR(20)',
            notNull: true
        },
        photo_product: {
            type: 'VARCHAR',
            notNull: true
        },
        id_inventory: {
            type: 'JSON'
        },
        price: {
            type: 'DECIMAL',
        },
        special_price: {
            type: 'DECIMAL',
            default: null
        },
        total_quantity: {
            type: 'INTEGER',
        },
        is_available: {
            type: 'BOOLEAN',
            notNull: true,
            default: true
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
    });
};

exports.down = pgm => {
    pgm.dropTable('products');
};
