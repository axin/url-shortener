const Router = require('express-promise-router');
const db = require('../db');

const router = new Router();

router.get('/:hash', async (req, res) => {
    const { hash } = req.params;

    const client = await db.getClient();

    try {
        await client.query('BEGIN');

        const getOriginalUrlQuery = {
            name: 'get-original-url',
            text: 'SELECT original_url AS "originalUrl" FROM shortened_urls WHERE short_url_hash = $1',
            values: [hash]
        };

        const getOriginalUrlQueryResult = await client.query(getOriginalUrlQuery);

        // No matches for given hash.
        if (!getOriginalUrlQueryResult.rowCount) {
            const error = new Error('Not Found');
            error.status = 404;

            throw error;
        }

        const { originalUrl } = getOriginalUrlQueryResult.rows[0];

        const incrementClickCounter = {
            name: 'increment-click-counter',
            text: 'UPDATE shortened_urls SET clicks = clicks + 1 WHERE short_url_hash = $1',
            values: [hash]
        };

        await client.query(incrementClickCounter);
        await client.query('COMMIT');

        res.redirect(originalUrl);
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
});

module.exports = router;
