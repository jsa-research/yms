yms
======

Server for projects built with [ymb](https://www.npmjs.org/package/ymb). Runs on top of [express](http://expressjs.com/).

Requirements
------------
yms works with Node.js 7+

Fast start
---------------
```bash
# Install yms into your project
npm install --save-dev yms

# Generate `server.js` file (and tune it if needed)
./node_modules/.bin/yms configure .

# Start yms server
node server.js
```


CLI usage
---------------
````bash
yms configure [DIR=.] [-f]          # Makes a copy of default `server.js` in specified directory.
yms help                            # Displays this message.
````

Plugins usage
---------------
Check out [**ymb plugins documentation**](docs/plugins.md).