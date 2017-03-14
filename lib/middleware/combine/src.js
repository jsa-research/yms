const path = require('path');
const _ = require('lodash');
const vow = require('vow');
const fs = require('vow-fs');
const md5 = require('md5-jkmyers');
const clc = require('cli-color');
const PublicError = require('../../PublicError');

const modulesCache = {};

/**
 * Loads requested modules from disk or local cache.
 * Maps files names from aliases.
 * @alias "combine.src"
 */
module.exports = async(ctx, next) => {
    const { query: { load }, yms: { src, cacheEnabled, development, requestId } } = ctx;

    if (development) {
        console.time(`[${clc.blackBright(requestId)}] From ${clc.cyan('combine.src')} to ${clc.cyan('combine.format')}`);
    }

    if (!load) {
        throw new PublicError('Empty `load` parameter');
    }

    const aliases = splitAliases(load);
    const hashes = aliases.map(md5);
    const hashAliasMap = _.zipObject(hashes, aliases);
    const pickedFromCache = cacheEnabled ? cacheLookup(src, hashes) : {};
    const cachedModules = _.values(pickedFromCache);
    const cachedHashes = _.keys(pickedFromCache);
    const missingHashes = _.xor(hashes, cachedHashes);

    if (development) {
        console.log(
            `[${clc.blackBright(requestId)}] Loading ${clc.green.bold(cachedHashes.length)} module(s) from cache and ${clc.green.bold(missingHashes.length)} module(s) from file system.`
        );
    }

    if (!missingHashes.length) {
        ctx.body = _.values(pickedFromCache);

        return next();
    }

    const loadedModules = await readModules(src, missingHashes, hashAliasMap);

    addToCache(src, missingHashes, loadedModules);

    ctx.body = [
        ...cachedModules,
        ...loadedModules
    ];

    return next();
};

function splitAliases(loadString) {
    var aliases = [];

    for (var i = 0, l = loadString.length; i < l; i += 2) {
        aliases.push(loadString.substring(i, i + 2));
    }

    return aliases;
}

function cacheLookup(src, hashes) {
    if (!modulesCache[src]) {
        return null;
    }

    return _.pick(modulesCache[src], hashes);
}

async function readModules(src, missingHashes, hashAliasMap) {
    const missingPaths = missingHashes.map((hash) => path.join(src, hash[0], hash[1], hash));
    let loaded;

    try {
        loaded = await vow.all(_.map(missingPaths, (path) => fs.read(path, 'utf-8')));
    } catch (err) {
        throw new PublicError('Parameter `load` is malformed');
    }

    return loaded.map((contents, i) => ({
        contents,
        hash: missingHashes[i],
        alias: hashAliasMap[missingHashes[i]]
    }));
}

function addToCache(src, hashes, modules) {
    if (!modulesCache[src]) {
        modulesCache[src] = {};
    }

    Object.assign(modulesCache[src], _.zipObject(hashes, modules));
}
