var gulp = require('gulp');

module.exports = mapSrcPlugin;

/**
 * @ignore
 * Loads `map.json` into stream.
 * @alias "map.src"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function mapSrcPlugin (data) {
    // TODO cache
    return gulp.src(data.src + 'map.json');
}