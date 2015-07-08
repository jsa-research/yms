var wrapper = require('gulp-fast-wrapper');

module.exports = jsonpPlugin;

/**
 * Wraps code with a JSONP callback with a specified name.
 * @alias "jsonp"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function jsonpPlugin (data) {
    var query = data.req.query,
        name = query.callback || (query.callback_prefix + '_' + query.load);

    return wrapper({
        header: 'window[\''+ name + '\'](',
        footer: ');'
    });
}