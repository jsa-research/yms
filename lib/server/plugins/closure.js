var wrapper = require('gulp-fast-wrapper');

module.exports = closurePlugin;

function closurePlugin () {
    return wrapper({
        header: '(function (global){',
        footer: '})(this);'
    });
}