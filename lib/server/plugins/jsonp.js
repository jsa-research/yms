var through = require('through2'),
    wrapper = require('gulp-fast-wrapper');

module.exports = jsonpPlugin;

/**
 * Wraps code with a JSONP callback with a specified name.
 * @alias "jsonp"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function jsonpPlugin (data) {
    var query = data.req.query;

    data.res.set({
        'Content-Type': 'application/javascript; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': 'attachment; filename=json.txt'
    });

    if (!query.callback && !query.callback_prefix) {
        return through.obj();
    }

    var name = query.callback || (query.callback_prefix + '_' + query.load);
    name = name.replace(/[\\'"]/g, "\\$&");

    return wrapper({
        header: 'window[\'' + name + '\'](',
        footer: ');'
    });
}
