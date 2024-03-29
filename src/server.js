require('dotenv').config();

const express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require('path'),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express"),
    { swaggerOptions } = require('./utils/index'),
    specs = swaggerJsdoc(swaggerOptions);
    app = express();
    
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
// simple route
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.get('/', function(req, res) {
    res.redirect('/docs');
});

require('./api/inventory/routes')(app);
require('./api/users/routes')(app);
require('./api/auth/routes')(app);
require('./api/products/routes')(app);

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
    if(process.env.NODE_ENV == 'production'){
        console.log(`Server is running on ${process.env.PROD_HOST}.`);
    } else {
        console.log(`Server is running on ${process.env.HOST}:${PORT}.`);
    }
});
