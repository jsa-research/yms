var _ = require('lodash'),
    gulp = require('gulp'),
    through = require('through2'),
    md5 = require('md5-jkmyers'),
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
        query = data.req.query;

    if (!query.load) {
        data.error = 'Empty `load` parameter';
        stream.end();

        return stream;
    }

    var aliases = splitAliases(query.load),
        hashes = _.map(aliases, md5),
        hashAliasMap = _.zipObject(hashes, aliases),
        cachedModules = data.cacheEnabled ? cacheLookup(data.src, hashes) : {},
        cachedHashes = _.keys(cachedModules),
        missingHashes = _.xor(hashes, cachedHashes),
        glob = _.map(missingHashes, function (hash) {
            return data.src + hash[0] + '/' + hash[1] + '/' + hash;
        }),
        onProcessed = function (count) {
            if (count != glob.length) {
                data.error = 'Parameter `load` is malformed';
            }
        };

    fillStream(stream, cachedModules);

    if (glob.length) {
        gulp.src(glob)
            .pipe(addToCache(data.src, hashAliasMap, onProcessed))
            .pipe(stream);
    } else {
        stream.end();
    }

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

function addToCache (src, hashAliasMap, onProcessed) {
    var cache = modulesCache[src] || (modulesCache[src] = {}),
        count = 0;

    return through.obj(function (file, encoding, cb) {
        count++;
        var hash = file.relative.substring(file.relative.lastIndexOf('/') + 1),
            alias = hashAliasMap[hash];

        file.alias = alias;

        if (!cache[hash]) {
            cache[hash] = {
                alias: alias,
                contents: file.contents
            };
        }

        cb(null, file);
    }, function (cb) {
        onProcessed(count);
        cb();
    });
}

function fillStream (stream, modules) {
    _.each(modules, function (module, hash) {
        var file = new gutil.File({
                cwd: '',
                base: '',
                path: hash,
                contents: module.contents,
                alias: module.alias
            });

        file.hash = hash;

        stream.push(file);
    });
}