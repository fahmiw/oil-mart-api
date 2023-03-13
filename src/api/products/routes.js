const ProductsHandler = require('./handler');
const ProductsService = require('../../services/postgres/ProductsService');
const InventoryService = require('../../services/postgres/InventoryService');
const ProductValidator = require('../../validator/products');
const multer = require('multer');
const { storage, filter, maxSize } = require('../../utils');

module.exports = app => {
    var router = require('express').Router();
    const inventoryService = new InventoryService();
    const productsService = new ProductsService();
    const productsHandler = new ProductsHandler(productsService, ProductValidator, inventoryService);

    const upload = multer({ 
        storage: storage('./public/uploads/products', 'product'),
        fileFilter: filter,
        limits: { fileSize: maxSize }
    });
    
    router.post('/', upload.single('photo_product'), productsHandler.postProductHandler);
    router.get('/', productsHandler.getProductHandler);
    router.put('/:id', upload.single('photo_product'), productsHandler.putProductHandler);
    router.delete('/:id', productsHandler.deleteProductHandler);

    app.use('/v1/products', router);
}