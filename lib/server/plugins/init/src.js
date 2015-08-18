var fs = require('fs'),
    file = require('gulp-file');

module.exports = initSrcPlugin;

var contents = null;

/**
 * Loads `init.js` into stream.
 * @alias "init.src"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function initSrcPlugin (data) {
    if (!data.cacheEnabled || !contents) {
        contents = fs.readFileSync(data.src + 'init.js');
    }

    return file('init.js', contents, { src: true });
}