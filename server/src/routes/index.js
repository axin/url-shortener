const root = require('./root');
const api = require('./api');

module.exports = app => {
    app.use('/', root);
    app.use('/api', api);
};
