const path = require('path');
const minimist = require('minimist');
const Koa = require('koa');
const Router = require('koa-router');
const compose = require('koa-compose');
const cors = require('kcors');
const clc = require('cli-color');
const m = require('yms').middleware;
const PublicError = require('yms').PublicError;

const args = minimist(process.argv);
const source = args.port || args.p || args.socket || 8000;
const app = new Koa();

app
    .use(handleError)
    .use(yms())
    .use(cors());

function handleError(ctx, next) {
    return next()
        .catch((err) => {
            console.error(err);
            
            const showMessage = ctx.yms && ctx.yms.development || error instanceof PublicError;

            ctx.status = err.status || 500;
            ctx.body = {
                error: true,
                message: showMessage && err.message || 'Internal Server Error'
            };
        });
}

function yms() {
    const router = new Router();

    router.get('/init.js',
        m.init.src,
        m.init.env,
        m.init.setupAsync,
        m.closure
    );

    router.get('/combine.js',
        m.combine.src,
        m.combine.format,
        m.jsonp
    );

    router.get('/map.js',
        m.map.src,
        m.jsonp
    );

    return compose([
        setupYms,
        router.routes(),
        router.allowedMethods()
    ]);
}

function setupYms(ctx, next) {
    const { mode = '' } = ctx.query;

    ctx.yms = {
        src: path.join('build', mode),
        env: {},
        development: args.development,
        cacheEnabled: !args.development,
        requestId: '#' + `${Date.now() + Math.random()}`.substr(9, 7)
    };

    return next();
}

app.listen(source, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server ${clc.cyan.bold('yms')} started on ${clc.magenta(source)}`);
    }
});