module.exports = class PublicError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this);
    }
};
