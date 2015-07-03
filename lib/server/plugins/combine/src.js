var _ = require('lodash'),
    path = require('path'),
    vow = require('vow'),
    gulp = require('gulp'),
    through = require('through2'),
    hashMap = require('../../util/hashMap'),
    gutil = require('gulp-util');

module.exports = combineSrcPlugin;

var modulesCache = {};

function combineSrcPlugin (data) {
    var stream = through.obj(),
        query = data.req.query,
        aliases = splitAliases(query.load);

    hashMap(data.src).fromAliases(aliases)
        .then(function (hashes) {
            var cachedModules = cacheLookup(data.src, hashes),
                cachedHashes = _.keys(cachedModules),
                missingHashes = _.xor(hashes, cachedHashes),
                glob = _.map(missingHashes, function (hash) {
                    return data.src + hash[0] + '/' + hash[1] + '/' + hash;
                });

            gulp.src(glob)
                .pipe(updateCacheAndAttachCached(data.src, cachedModules))
                .pipe(stream);
        })
        .fail(function (err) {
            console.error(err);
            stream.end();
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
        var hash = path.basename(file.relative);

        if (!cache[hash]) {
            cache[hash] = file.contents;
        }

        cb(null, file);
    }, function (cb) {
        var stream = this;

        _.each(cachedModules, function (buffer, hash) {
            stream.push(new gutil.File({
                cwd: '',
                base: '',
                path: path.join(src, hash[0], hash[1], hash),
                contents: buffer
            }));
        });

        cb();
    });
}