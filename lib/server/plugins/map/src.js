var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    gulp = require('gulp'),
    through = require('through2'),
    file = require('gulp-file');

module.exports = mapSrcPlugin;

var contents = {};

/**
 * @ignore
 * Loads `map.json` into stream.
 * @alias "map.src"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function mapSrcPlugin (data) {
    if (!contents[data.src]) {
        contents[data.src] = stringifyMap(require(path.resolve(data.src + 'map.json')));
    }

    return file('map.json', contents[data.src], { src: true });
}

// TODO shared with ymb
function stringifyMap (map) {
    var stack = [];

    _.each(map, function (moduleInfo) {
        stack.push('[' + _.map(moduleInfo, function (value, index) {
                if (index == 2 && value.slice(0, 8) == 'function') {
                    return value;
                } else if (index == 5 && typeof value == 'object') {
                    return '{ ' + _.map(value, function (v, k) { return k + ': ' + v; }).join(', ') + ' }';
                } else {
                    return '\'' + value + '\'';
                }
            }).join(', ') + ']');
    });

    return '[\n    ' + stack.join(',\n    ') + '\n]';
}
