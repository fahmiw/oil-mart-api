const multer = require('multer');
var url = require('url');

const pagina = (items, page = 1, perPage = 10) => {
    const offset = perPage * (page - 1);
    const totalPages = Math.ceil(items.length / perPage);
    const paginatedItems = items.slice(offset, perPage * page);
  
    return {
        previousPage: page - 1 ? page - 1 : null,
        nextPage: (totalPages > page) ? page + 1 : null,
        total: items.length,
        totalPages: totalPages,
        items: paginatedItems
    };
};

const storage = (path, typename) => multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Math.round(Math.random() * 1E9)
        cb(null, typename + '-' + uniqueSuffix + file.originalname.slice((file.originalname.lastIndexOf(".") - 2 >>> 0) + 2))
    }
});

const filter = (req, file, cb) => {
    if( file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const fullUrl = (req) => {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
  });
}

const maxSize = 1000000;

module.exports = { pagina, storage, filter, maxSize, fullUrl }
    