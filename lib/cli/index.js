const minimist = require('minimist');

const args = parseArgs();

if (args.action == 'configure') {
    require('./configure')(args.projectDir, args.force);
}

function parseArgs() {
    const args = minimist(process.argv);

    return {
        action: args._[2],
        projectDir: args._[3] || process.cwd(),
        force: args.f || args.force
    };
}