var path = require('path'),
    wrapper = require('gulp-fast-wrapper'),
    concat = require('gulp-concat'),
    through = require('through2'),
    pipeChain = require('../util/pipeChain');

module.exports = formatPlugin;

/**
 * Wraps modules in closures and joins them into a single output file.
 * @alias "combine.format"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function formatPlugin (data) {
    var query = data.req.query,
        supportNamespace = query.namespace ? ', ' + query.namespace.replace(/[^\w\$_]/gi, '') : '';

    return pipeChain(
        through.obj(function (file, _, cb) {
            file.contents = Buffer.concat([
                new Buffer('[\'' + file.alias + '\', function (ym' + supportNamespace + ') {\n'),
                file.contents,
                new Buffer('}]')
            ]);

            cb(null, file);
        }),

        concat('#', { newLine: ',' }),

        wrapper({
            header: '[',
            footer: ', 0]' // TODO WAT!
        })
    )
}