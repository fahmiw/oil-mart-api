const InventoryHandler = require('./handler');
const InventoryService = require('../../services/postgres/InventoryService');
const InventoryValidator = require('../../validator/inventory');
const multer = require('multer');
const { storage, filter, maxSize } = require('../../utils');


module.exports = app => {
    var router = require('express').Router();
    const inventoryService = new InventoryService();
    const inventoryHandler = new InventoryHandler(inventoryService, InventoryValidator);
    
    const upload = multer({ 
        storage: storage('./public/uploads/inventory', 'inventory'),
        fileFilter: filter,
        limits: { fileSize: maxSize }
    });
    
    router.post('/', upload.single('photo'), inventoryHandler.postInventoryHandler);
    router.get('/', inventoryHandler.getInventoryHandler);
    router.put('/:id', upload.single('photo'), inventoryHandler.putInventoryHandler);
    router.delete('/:id', inventoryHandler.deleteInventoryHandler);

    app.use('/v1/inventory', router);
}