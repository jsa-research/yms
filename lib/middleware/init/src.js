const fs = require('fs');
const clc = require('cli-color');

const cache = {};

/**
 * Read `init.js` file from file system or load it from cache.
 * @alias "init.src"
 */
module.exports = (ctx, next) => {
    const { yms: { src, cacheEnabled, development, requestId } } = ctx;

    if (development) {
        console.time(`[${clc.blackBright(requestId)}] From ${clc.cyan('init.src')} to ${clc.cyan('init.setupAsync')}`);
    }

    if (!cacheEnabled || !cache[src]) {
        cache[src] = fs.readFileSync(src + '/init.js', 'utf-8');
    }

    ctx.body = cache[src];
    
    return next();
};