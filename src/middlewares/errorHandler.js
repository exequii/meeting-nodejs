function logErrors (err, req, res, next) {
    console.error(err);
    next(err);
}

function errorNotFound(req, res, next)  {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
};

function errorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
}

module.exports = { logErrors, errorHandler, errorNotFound }