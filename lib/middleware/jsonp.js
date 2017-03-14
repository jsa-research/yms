/**
 * Wraps code with a JSONP callback with a specified name.
 * @alias "jsonp"
 */
module.exports = (ctx, next) => {
    const { query } = ctx;
    
    if (!query.callback && !query.callback_prefix) {
        return next();
    }
    
    ctx.set({
        'Content-Type': 'application/javascript; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': 'attachment; filename=json.txt'
    });

    let name = query.callback || (query.callback_prefix + '_' + query.load);
    name = name.replace(/[\\'"]/g, "\\$&");

    ctx.body = `window['${name}'](\n${ctx.body}\n);`;
    
    return next();
};
