var path = require('path'),
    vow = require('vow'),
    fs = require('vow-fs');

module.exports = configure;

var rootPath = path.resolve(__dirname, '../../');

function configure (dir, force) {
    copyDefault(rootPath + '/defaults/server.js', dir, 'server.js', force);
}

function copyDefault (defaultFilePath, dir, filename, force) {
    fs.exists(dir + '/' + filename).then(function (exists) {
        if (exists && !force) {
            return vow.reject(new Error(
                'Can\'t configure. File `' + filename + '` already exists and no `--force` parameter provided.'
            ));
        }
    }).then(function () {
        fs.copy(defaultFilePath, dir + '/' + filename);
    }).then(function () {
        console.log('Now you have your copy of default `' + filename + '`.');
    }).fail(function (e) {
        console.error('Error: ' + (e.message || e));
    });
}
