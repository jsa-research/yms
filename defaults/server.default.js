var fs = require('fs'),
    path = require('path'),
    yms = require('yms'),
    plg = yms.plugins,
    // You can require your own packages.
    express = yms.express,
    minimist = yms.minimist;

var UNIX_SOCKET = '/tmp/node-{username}-{directory}.sock'
        .replace('{username}', process.env.USER)
        .replace('{directory}', path.basename(process.cwd()));

var app = express(),
    args = minimist(process.argv),
    source = args.port || args.p || UNIX_SOCKET;

app.get(['/', '/:action(init|index|combine|map)(.js|.xml)?'], handleYms);
app.listen(source, function () {
    if (isNaN(parseInt(source))) {
        fs.chmod(source, '0777');
    }
});

console.log('Server `yms` is listening ' + source + '.');

function handleYms (req, res) {
    var data = {
            req: req,
            res: res,
            src: './build/' + (req.query.mode ? req.query.mode + '/' : ''),
            env: {}
        };

    res.set('Content-Type', 'text/javascript');

    switch (req.params.action) {
        case 'combine': return handleCombine(data);
        case 'map': return handleMap(data);
        default: return handleInit(data);
    }
}

function handleInit (data) {
    plg.init.src(data)
        .pipe(plg.init.setupAsync(data))
        .pipe(plg.closure(data))
        .pipe(plg.contents(data))
        .pipe(data.res);
}

function handleCombine (data) {
    plg.combine.src(data)
        .pipe(plg.combine.format(data))
        .pipe(plg.jsonp(data))
        .pipe(plg.contents(data))
        .pipe(data.res);
}

function handleMap (data) {
    plg.map.src(data)
        .pipe(plg.jsonp(data))
        .pipe(plg.contents(data))
        .pipe(data.res);
}