const path = require('path');
const clc = require('cli-color');

/**
 * Wraps modules in closures and joins them into a single output file.
 * @alias "combine.format"
 */
module.exports = (ctx, next) => {
    const { query: { namespace }, yms: { development, requestId } } = ctx;
    const supportNamespace = namespace ? `, ${namespace.replace(/[^\w\$_]/gi, '')}` : '';

    ctx.body = [
        '[',
        ctx.body.map(
            (module) => `['${module.alias}', function (ym${supportNamespace}) {\n${module.contents}}]`
        ).join(',\n'),
        ']'
    ].join('\n');

    if (development) {
        console.timeEnd(`[${clc.blackBright(requestId)}] From ${clc.cyan('combine.src')} to ${clc.cyan('combine.format')}`);
    }

    return next();
};
