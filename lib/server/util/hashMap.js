var _ = require('lodash'),
    vow = require('vow'),
    fs = require('vow-fs');

module.exports = getHashMap;

var hashMaps = {};

function getHashMap (dir) {
    return hashMaps[dir] || (hashMaps[dir] = new HashMap(dir));
}

function HashMap (dir) {
    this._dir = dir;
    this._hashesPromise = null;
    this._hashesInversePromise = null;
}

HashMap.prototype = {
    fromAliases: function (aliases) {
        return this._getHashes().then(function (hashes) {
            if (aliases.length == 1) {
                return [hashes[aliases[0]]];
            }

            return _.map(aliases, function (alias) { return hashes[alias]; });
        });
    },

    toAliases: function (hashes) {
        return this._getHashesInverse().then(function (hashesInverse) {
            if (hashes.length == 1) {
                return [hashesInverse[hashes[0]]];
            }

            return _.map(hashes, function (hash) { return hashesInverse[hash]; });
        });
    },

    _getHashes: function () {
        return this._hashesPromise || (this._hashesPromise = this._loadHashes());
    },

    _loadHashes: function () {
        return fs.read(this._dir + 'hashes.json').then(function (contents) {
            return JSON.parse(contents);
        });
    },

    _getHashesInverse: function () {
        return this._hashesInversePromise || (this._hashesInversePromise = this._invertHashes());
    },

    _invertHashes: function () {
        return this._getHashes().then(function (hashes) {
            return _.invert(hashes);
        });
    }
};