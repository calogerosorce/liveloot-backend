function serverError(err, req, res, next) {
    console.error(err && err.stack ? err.stack : err);
    res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
}

module.exports = serverError;