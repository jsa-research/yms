/**
 * Wraps body in a simple JS closure.
 * @alias "closure"
 */
module.exports = (ctx, next) => {
    ctx.body = [
        '(function (global){',
        ctx.body,
        '})(this);'
    ].join('\n');

    next();
}