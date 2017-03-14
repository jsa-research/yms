const fs = require('fs');
const path = require('path');
const _ = require('lodash');

var cache = {};

function requireFresh(src) {
    delete require.cache[require.resolve(src)];
    return require(src);
}

/**
 * Loads `map.json`.
 * @alias "map.src"
 */
module.exports = (ctx, next) => {
    const { yms: { src, cacheEnabled } } = ctx;

    if (!cacheEnabled || !cache[src]) {
        cache[src] = stringifyMap(
            requireFresh(path.resolve(src, 'map.json'))
        );
    }

    ctx.body = cache[src];

    return next();
};

function stringifyMap(map) {
    const stack = [];

    _.each(map, (moduleInfo) => {
        stack.push('[' + _.map(moduleInfo, (value, index) => {
                if (index == 2 && value.slice(0, 8) == 'function') {
                    return value;
                } else if (index == 5 && typeof value == 'object') {
                    return `{ ${_.map(value, (v, k) => `${k}: ${v}`).join(', ')} }`;
                } else {
                    return `'${value}'`;
                }
            }).join(', ') + ']');
    });

    return `[\n    ${stack.join(',\n    ')}\n]`;
}
