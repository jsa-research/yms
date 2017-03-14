const util = require('util');
const vow = require('vow');
const _ = require('lodash');
const clc = require('cli-color');
const RawValue = require('../../RawValue');

/**
 * Adds code for calling `setupAsync` function of `init.js` file with request and environment params.
 * Properties of `ctx.yms.env` may be both primitives and promises: middleware will wait for them to be resolved.
 * @alias "init.setupAsync"
 */
module.exports = async (ctx, next) => {
    const { yms: { env, development, requestId } } = ctx;

    const resolved = await resolveValues(env);
    ctx.body += `\nsetupAsync(${stringifyEnv(resolved)})`;

    if (development) {
        console.timeEnd(`[${clc.blackBright(requestId)}] From ${clc.cyan('init.src')} to ${clc.cyan('init.setupAsync')}`);
    }

    return next();
};

function resolveValues(obj) {
    return vow.all(_.values(obj))
        .then((results) => _.zipObject(_.keys(obj), results));
}

function stringifyEnv(env) {
    const keyValuePairs = _.map(env, (value, key) => util.format(
        '"%s":%s',
        key,
        value instanceof RawValue ? String(value.value) : JSON.stringify(value)
    )).join();

    return `{${keyValuePairs}}`;
}
