class expressError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ExpressError';
    }
}

module.exports = expressError;
