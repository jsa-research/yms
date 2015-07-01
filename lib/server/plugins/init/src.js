var fs = require('fs'),
    file = require('gulp-file');

module.exports = initSrcPlugin;

var contents = null;

function initSrcPlugin (data) {
    if (!contents) {
        contents = fs.readFileSync(data.src + 'init.js');
    }

    return file('init.js', contents, { src: true });
}