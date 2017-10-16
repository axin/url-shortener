const Router = require('express-promise-router');
const Base62 = require('base62');
const db = require('../db');

const router = new Router();

router.post('/shortened-urls', async (req, res) => {
    const { originalUrl } = req.body;

    validateUrl(originalUrl);

    const client = await db.getClient();

    try {
        await client.query('BEGIN');

        const addUrlQuery = {
            name: 'add-url',
            text: 'INSERT INTO shortened_urls(original_url, creation_date, clicks) VALUES($1, $2, $3) RETURNING (id)',
            values: [addProtocol(originalUrl), new Date(), 0]
        };

        const addUrlQueryResult = await client.query(addUrlQuery);
        const id = addUrlQueryResult.rows[0].id;
        const shortUrlHash = Base62.encode(id);

        const setShortendeUrlHashQuery = {
            name: 'set-shortened-url-hash',
            text: 'UPDATE shortened_urls SET short_url_hash = $1 WHERE id = $2',
            values: [shortUrlHash, id]
        };

        await client.query(setShortendeUrlHashQuery);
        await client.query('COMMIT');

        res.send({ shortUrlHash });
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
});

function validateUrl(url) {
    if (!url || typeof url !== 'string' || url.indexOf(' ') !== -1) {
        const error = new Error('URL is invalid!');
        error.code = 400;

        throw error;
    }

    if (url.length > 1000) {
        const error = new Error('URL should be shorter than 1000 characters!');
        error.code = 400;

        throw error;
    }
}

function addProtocol(url) {
    const hasProtocol = /^([^:]*:)?\/\//.test(url);

    return hasProtocol ? url : `http://${url}`;
}

router.get('/shortened-urls', async (req, res) => {
    let { offset, limit } = req.query;
    offset = Number(offset);
    limit = Number(limit);

    validateOffsetAndLimit(offset, limit);

    const client = await db.getClient();

    try {
        await client.query('BEGIN');

        const getUrlsQuery = {
            name: 'get-urls',
            text: 'SELECT original_url AS "originalUrl", creation_date AS created, ' +
            'short_url_hash AS "shortUrlHash", clicks AS "numberOfClicks" ' +
            'FROM shortened_urls OFFSET $1 LIMIT $2',
            values: [offset, limit]
        };

        const { rows } = await client.query(getUrlsQuery);

        const totalNumberOfItems =
            (await client.query('SELECT count(*) AS count FROM shortened_urls')).rows[0].count;

        await client.query('COMMIT');

        res.send({ totalNumberOfItems: Number(totalNumberOfItems), items: rows });
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
});

function validateOffsetAndLimit(offset, limit) {
    if (isNaN(offset) || isNaN(limit) || offset < 0 || limit < 1) {
        const error = new Error('Invalid query!');
        error.code = 400;

        throw error;
    }
}

module.exports = router;
