var _ = require('lodash'),
    path = require('path'),
    gulp = require('gulp'),
    through = require('through2'),
    hashMap = require('../../util/hashMap'),
    gutil = require('gulp-util');

module.exports = combineSrcPlugin;

var modulesCache = {};

/**
 * Loads requested modules into stream from disk or local cache.
 * Maps files names from aliases.
 * @alias "combine.src"
 * @param {Object} data Cross-plugin request data
 * @returns {stream.Transform} Stream
 */
function combineSrcPlugin (data) {
    var stream = through.obj(),
        query = data.req.query,
        aliases = splitAliases(query.load);

    hashMap(data.src, data.cacheEnabled).fromAliases(aliases, function (hashes) {
        if (_.some(hashes, function (hash) { return !hash; })) {
            data.error = '`load` param is malformed';
            stream.end();

            return;
        }

        var cachedModules = data.cacheEnabled ? cacheLookup(data.src, hashes) : {},
            cachedHashes = _.keys(cachedModules),
            missingHashes = _.xor(hashes, cachedHashes),
            glob = _.map(missingHashes, function (hash) {
                return data.src + hash[0] + '/' + hash[1] + '/' + hash;
            });

        if (glob.length) {
            gulp.src(glob)
                .pipe(updateCacheAndAttachCached(data.src, cachedModules))
                .pipe(stream);
        } else {
            fillStream(stream, cachedModules);
            stream.end();
        }
    });

    return stream;
}

function splitAliases (loadString) {
    var aliases = [];

    for (var i = 0, l = loadString.length; i < l; i += 2) {
        aliases.push(loadString.substring(i, i + 2));
    }

    return aliases;
}

function cacheLookup (src, hashes) {
    if (!modulesCache[src]) {
        return null;
    }

    return _.pick(modulesCache[src], hashes);
}

function updateCacheAndAttachCached (src, cachedModules) {
    var cache = modulesCache[src] || (modulesCache[src] = {});

    return through.obj(function (file, encoding, cb) {
        var hash = file.relative.substring(file.relative.lastIndexOf('/') + 1);

        file.hash = hash;

        if (!cache[hash]) {
            cache[hash] = file.contents;
        }

        cb(null, file);
    }, function (cb) {
        fillStream(this, cachedModules);
        cb();
    });
}

function fillStream (stream, buffers) {
    _.each(buffers, function (buffer, hash) {
        var file = new gutil.File({
                cwd: '',
                base: '',
                path: hash,
                contents: buffer
            });

        file.hash = hash;

        stream.push(file);
    });
}