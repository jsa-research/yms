var _ = require('lodash'),
    path = require('path'),
    vow = require('vow'),
    gulp = require('gulp'),
    through = require('through2'),
    hashMap = require('../../util/hashMap');

module.exports = combineSrcPlugin;

var filesCache = {};

function combineSrcPlugin (data) {
    var stream = through.obj(),
        query = data.req.query,
        aliases = splitAliases(query.load);

    hashMap(data.src).fromAliases(aliases)
        .then(function (hashes) {
            var cachedFiles = cacheLookup(data.src, hashes),
                cachedHashes = _.keys(cachedFiles),
                missingHashes = _.xor(hashes, cachedHashes),
                glob = _.map(missingHashes, function (hash) {
                    return data.src + hash[0] + '/' + hash[1] + '/' + hash;
                });

            gulp.src(glob)
                .pipe(updateCacheAndAttachCached(data.src, cachedFiles))
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
    if (!filesCache[src]) {
        return null;
    }

    return _.pick(filesCache[src], hashes);
}

function updateCacheAndAttachCached (src, cachedFiles) {
    var cache = filesCache[src] || (filesCache[src] = {});

    return through.obj(function (file, encoding, cb) {
        var hash = path.basename(file.relative);

        cache[hash] = file;

        cb(null, file);
    }, function (cb) {
        var stream = this;

        _.each(cachedFiles, function (file) {
            stream.push(file);
        });

        cb();
    });
}