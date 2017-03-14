const PublicError = require('yms').PublicError;

/**
 * Catches exceptions thrown in all following middleware and covers it into a nice JSON error.
 * @alias "handleErrors"
 */
module.exports = (ctx, next) => {
    return next()
        .catch((err) => {
            const isDev = ctx.yms && ctx.yms.development;
            const showMessageToUser = isDev || error instanceof PublicError;

            if (isDev) {
                console.error(err);
            } else {
                console.log(err);
            }

            ctx.status = err.status || 500;
            ctx.body = {
                error: true,
                message: showMessageToUser && err.message || 'Internal Server Error'
            };
        });
};
