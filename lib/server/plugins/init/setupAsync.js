var util = require('util'),
    vow = require('vow'),
    _ = require('lodash'),
    through = require('through2'),
    RawValue = require('../../util/RawValue');

module.exports = setupAsyncPlugin;

var OMIT_SYS_PARAMS = ['lang', 'load', 'onLoad', 'onError'];

var initTimestamp = +new Date();

/**
 * Adds code for calling `setupAsync` function of `init.js` file with current request and environment params.
 * Generates representation of `data.env` content and provides it as a parameter for function call.
 * Properties of `data.env` may be both primitives and `promise`-objects: plugin will wait for them to be resolved.
 * @alias "init.setupAsync"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function setupAsyncPlugin (data) {
    var query = data.req.query,
        env = data.env;

    env.server = {
        url: '//' + data.req.headers.host,
        path: data.src,
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

    return through.obj(function (file, encoding, cb) {
        vow.all(_.values(env)).then(function (results) {
            env = _.zipObject(_.keys(env), results);

            file.contents = Buffer.concat([
                file.contents,
                new Buffer('\nsetupAsync(' + stringifyEnv(env) + ');')
            ]);

            cb(null, file);
        }).fail(function (err) {
            data.error = err;
            cb(null, file);
        });
    });
}

/**
 * @param {Object} env
 * @returns {String}
 */
function stringifyEnv(env) {
    var keyValuePairs = _.map(env, function (value, key) {
        var valueStr;
        if (value instanceof RawValue) {
            valueStr = String(value.value);
        } else {
            valueStr = JSON.stringify(value);
        }
        return util.format('"%s":%s', key, valueStr);
    });

    return '{' + keyValuePairs.join() + '}';
}
