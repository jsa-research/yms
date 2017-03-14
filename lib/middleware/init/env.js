const _ = require('lodash');

const OMIT_SYS_PARAMS = ['lang', 'load', 'onLoad', 'onError'];

const initTimestamp = Date.now();

/**
 * Fills `ctx.yms.env` with needed request and environment params.
 * @alias "init.env"
 */
module.exports = (ctx, next) => {
    const { query, yms: { env } } = ctx;

    env.server = {
        url: '//' + ctx.headers.host,
        path: ctx.yms.src,
        params: _.omit(query, OMIT_SYS_PARAMS),
        version: initTimestamp
    };

    if (typeof query.load != 'undefined') {
        env.preload = {
            load: query.load,
            onLoad: query.onLoad || query.onload,
            onError: query.onError || query.onerror
        }
    }

    if (query.mode) {
        env.mode = query.mode;
        env.debug = env.mode && env.mode == 'debug';
    }

    if (typeof query.ns != 'undefined') {
        env.namespace = ['', 'false', 'null'].indexOf(query.ns) != -1 ? false : query.ns;
    }

    return next();
};
