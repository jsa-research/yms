var through = require('through2');

module.exports = contentsPlugin;

/**
 * Replaces Vinyl files in stream with their contents.
 * @alias "contents"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function contentsPlugin (data) {
    var empty = true,
        errorFound = false;

    return through.obj(function (file, _, cb) {
        empty = false;

        if (data.error) {
            errorFound = true;
            cb(null, JSON.stringify({ error: data.error }));
        }

        if (!errorFound) {
            cb(null, file.contents);
        }
    }, function (cb) {
        if (empty) {
            this.push(JSON.stringify({ error: data.error || 'Unknown error' }));
        }

        cb();
    });
}