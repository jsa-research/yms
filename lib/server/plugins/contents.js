var _ = require('lodash'),
    through = require('through2');

module.exports = contentsPlugin;

/**
 * Replaces Vinyl files in stream with their contents.
 * @alias "contents"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function contentsPlugin (data) {
    var parts = [];

    return through.obj(function (file, encoding, cb) {
        parts.push(file.contents);
        cb(null);
    }, function (cb) {
        if (!parts.length) {
            data.error = 'Content not found';
        }

        if (data.error) {
            this.push(JSON.stringify({ error: data.error }));
        } else {
            _.each(parts, this.push, this);
        }

        cb();
    });
}