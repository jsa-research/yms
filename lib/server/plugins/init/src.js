var fs = require('fs'),
    file = require('gulp-file');

module.exports = initSrcPlugin;

var contents = {};

/**
 * Loads `init.js` into stream.
 * @alias "init.src"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function initSrcPlugin (data) {
    if (!data.cacheEnabled || !contents[data.src]) {
        contents[data.src] = fs.readFileSync(data.src + 'init.js');
    }

    return file('init.js', contents[data.src], { src: true });
}