const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const mountRoutes = require('./routes');
const { appPort } = require('./config');

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, '../../client/dist')));
app.use(bodyParser.json());

mountRoutes(app);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    if (req.xhr || req.headers.accept.indexOf('json') !== -1) {
        res.send({
            message: err.message || 'Something went wrong!'
        });
    } else {
        res.render('error', {
            message: err.message
        });
    }
});

app.listen(appPort);

module.exports = app;
