var wrapper = require('gulp-fast-wrapper');

module.exports = closurePlugin;

/**
 * Wraps code in a simple JS closure.
 * @alias "closure"
 * @returns {stream.Transform} Stream
 */
function closurePlugin () {
    return wrapper({
        header: '(function (global){',
        footer: '})(this);'
    });
}