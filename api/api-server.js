const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const router = express.Router();
const http = require('http');
const config = require('./config');
const mongoose = require('mongoose');
const morgan = require('morgan');
var logger = require('./api/service/logger');
var cors = require('cors');

// const helmet = require('helmet');
// app.use(helmet());
//require('./cron/index.js');

// generate custom token
morgan.token('host', function(req) {
    return req.hostname;
});

app.use(
    cors({
        origin: '*'
    })
);

// setup the logger
app.use(morgan(':method :host :url :status :res[content-length] - :response-time ms'));

// app.use(
//     session({
//         secret: config.sessionSecret,
//         resave: false,
//         saveUninitialized: true
//     })
// );

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
const socket = require('socket.io')(server);
require('./socket')(socket);

require('./routes/game-api')(router,socket);
require('./routes/index')(router);

app.use(express.static(path.join(__dirname, 'public')));

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
//app.engine('.html', require('ejs').renderFile);

app.use(
    bodyParser.urlencoded({
        extended: true,
        type: 'application/x-www-form-urlencoded'
    })
);

app.use('/', router);

// SSL code
// var certificate = fs.readFileSync( path.join(__dirname,'../SSL/certificate.crt'), 'utf8');
// var privateKey = fs.readFileSync(path.join(__dirname,'../SSL/private.key'), 'utf8');
// var chain = fs.readFileSync(path.join(__dirname,'../SSL/ca_bundle.crt'), 'utf8');

// var credentials = {
//     key: privateKey,
//     cert: certificate
//     // ca: chain
// };

// var server = https.createServer(credentials, app);


/**
 *	Server bootup section
 **/
try {
    // DB Connect
    mongoose.set('useCreateIndex', true);
    mongoose.connect(
        `${config.dbConnectionUrl}`,
        {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        },
        d => {
            if (d) return logger.info(`ERROR CONNECTING TO DB ${config.dbConnectionUrl}`, d);
            logger.info(`Connected to ${process.env.NODE_ENV} database: `, `${config.dbConnectionUrl}`);
            server.listen(config.port, function() {
                logger.info('Game API Server listening at PORT:' + config.port);
            });
        }
    );
} catch (err) {
    logger.info('DBCONNECT ERROR', err);
}

module.exports = server;
