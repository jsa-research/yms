var _ = require('lodash'),
    vow = require('vow'),
    fs = require('vow-fs');

module.exports = scope;

var hashesCache = {},
    hashesCacheInverse = {};

function scope (dir) {
    var hashes = hashesCache[dir] || null,
        hashesInverse = hashesCacheInverse[dir] || null;

    function fromAliases (aliases) {
        return getHashes().then(function (hashes) {
            return _.map(aliases, function (alias) { return hashes[alias]; });
        });
    }

    function toAliases (hashes) {
        return getHashesInverse().then(function (hashesInverse) {
            return _.map(hashes, function (hash) { return hashesInverse[hash]; });
        });
    }

    function getHashes () {
        return hashes ? vow.resolve(hashes) : loadHashes();
    }

    function loadHashes () {
        return fs.read(dir + 'hashes.json').then(function (contents) {
            return hashes = hashesCache[dir] || (hashesCache[dir] = JSON.parse(contents));
        });
    }

    function getHashesInverse () {
        return hashesInverse ? vow.resolve(hashesInverse) : invertHashes();
    }

    function invertHashes () {
        return getHashes().then(function (hashes) {
            return hashesInverse = hashesCacheInverse[dir] || (hashesCacheInverse[dir] = _.invert(hashes));
        });
    }

    return {
        fromAliases: fromAliases,
        toAliases: toAliases
    };
}
