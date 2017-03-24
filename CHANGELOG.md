2.0 (2017/03)
===
- Support for watch/rebuild on changes in `map.json` (modules definition)
- Get rid of `hashes.json` in favor of generating hashes from short aliases
- Migrate to **Node 7+**
  - ~1.5 times faster RPS
  - Native support for most ES6+ features including `async/await`
- Migrate to **Koa 3** from **Express**
- Migrate to **Koa middleware** from **Gulp plugins**
  - Cleaner code with async (promise-based) middleware
  - Better error handling
- Preferred local installation instead of global
  - Get rid of `yms server` command in favor of simple `node server.js`
  - Disable usage of default `server.js` without explicit copying
  - Requiring flat yms dependencies in the local `server.js` with **npm 3.x**
- CORS support added
- Prettify command line output
