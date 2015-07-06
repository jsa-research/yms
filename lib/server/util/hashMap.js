var fs = require('fs'),
    _ = require('lodash');

module.exports = getHashMap;

var hashMaps = {};

function getHashMap (dir) {
    return hashMaps[dir] || (hashMaps[dir] = new HashMap(dir));
}

function HashMap (dir) {
    this._dir = dir;
    this._hashes = null;
    this._hashesInverse = null;
}

HashMap.prototype = {
    fromAliases: function (aliases, cb) {
        return this._getHashes(function (hashes) {
            if (aliases.length == 1) {
                cb([hashes[aliases[0]]]);

                return;
            }

            cb(_.map(aliases, function (alias) { return hashes[alias]; }));
        });
    },

    toAliases: function (hashes, cb) {
        return this._getHashesInverse(function (hashesInverse) {
            if (hashes.length == 1) {
                cb([hashesInverse[hashes[0]]]);

                return;
            }

            cb(_.map(hashes, function (hash) { return hashesInverse[hash]; }));
        });
    },

    _getHashes: function (cb) {
        if (this._hashes) {
            cb(this._hashes);

            return;
        }

        var _this = this;

        fs.readFile(this._dir + 'hashes.json', function (err, contents) {
            cb(_this._hashes || (_this._hashes = JSON.parse(contents)));
        });
    },

    _getHashesInverse: function (cb) {
        if (this._hashesInverse) {
            cb(this._hashesInverse);

            return;
        }

        var _this = this;

        this._getHashes(function (hashes) {
            cb(_this._hashesInverse || (_this._hashesInverse = _.invert(hashes)));
        });
    }
};