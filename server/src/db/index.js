const { Pool } = require('pg');
const { connectionString } = require('../config');

const pool = new Pool({ connectionString });

const db = {
    query: (text, params) => pool.query(text, params),
    getClient: async () => await pool.connect()
};

module.exports = db;
