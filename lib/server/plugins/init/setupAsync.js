var vow = require('vow'),
    _ = require('lodash'),
    through = require('through2');

module.exports = setupAsyncPlugin;

var OMIT_SYS_PARAMS = ['lang', 'load', 'onLoad', 'onError'];

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
        url: data.req.protocol + '://' + data.req.headers.host,
        params: _.omit(query, OMIT_SYS_PARAMS)
    };

    if (query.load) {
        env.preload = {
            load: query.load,
            onLoad: query.onLoad,
            onError: query.onError
        }
    }

    if (query.mode) {
        env.mode = query.mode;
        env.debug = env.mode && env.mode == 'debug';
    }

    return through.obj(function (file, encoding, cb) {
        vow.all(_.values(env)).then(function (results) {
            env = _.zipObject(_.keys(env), results);

            file.contents = Buffer.concat([
                file.contents,
                new Buffer('\nsetupAsync(' + JSON.stringify(env) + ');')
            ]);

            cb(null, file);
        });
    });
}