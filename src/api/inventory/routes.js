const InventoryHandler = require('./handler');
const InventoryService = require('../../services/postgres/InventoryService');
const InventoryValidator = require('../../validator/inventory');
const multer = require('multer');


module.exports = app => {
    var router = require('express').Router();
    const inventoryService = new InventoryService();
    const inventoryHandler = new InventoryHandler(inventoryService, InventoryValidator);
    
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads/images')
        }
    });
      
    const upload = multer({ storage: storage });

    router.post('/', upload.single('photo'), inventoryHandler.postInventoryHandler);

    app.use('/v1/inventory', router);
}