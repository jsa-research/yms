var path = require('path'),
    wrapper = require('gulp-fast-wrapper'),
    concat = require('gulp-concat'),
    through = require('through2'),
    pipeChain = require('../util/pipeChain'),
    hashMap = require('../../util/hashMap');

module.exports = formatPlugin;

/**
 * Wraps modules in closures and joins them into a single output file.
 * @alias "combine.format"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function formatPlugin (data) {
    var query = data.req.query,
        hashes = hashMap(data.src, data.cacheEnabled),
        supportNamespace = query.namespace ? ', ' + query.namespace.replace(/[^\w\$_]/gi, '') : '';

    return pipeChain(
        through.obj(function (file, _, cb) {
            hashes.toAliases([file.hash], function (aliases) {
                file.contents = Buffer.concat([
                    new Buffer('[\'' + aliases[0] + '\', function (ym' + supportNamespace + ') {\n'),
                    file.contents,
                    new Buffer('}]')
                ]);

                cb(null, file);
            });
        }),

        concat('#', { newLine: ',' }),

        wrapper({
            header: '[',
            footer: ', 0]' // TODO WAT!
        })
    )
}