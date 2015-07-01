var gulp = require('gulp');

module.exports = initSrcPlugin;

var stream = null;

function initSrcPlugin (data) {
    return stream || (stream = gulp.src(data.src + 'init.js'));
}