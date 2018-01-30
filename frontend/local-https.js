const { Nuxt, Builder } = require('nuxt');

const https = require('https');
const fs = require('fs');
const isProd = (process.env.NODE_ENV === 'production');
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

// We instantiate nuxt.js with the options
const config = require('./nuxt.config.js');
config.dev = !isProd;
const nuxt = new Nuxt(config);

// Render every route with Nuxt.js

// Build only in dev mode with hot-reloading
if (config.dev) {
  new Builder(nuxt).build()
    .then(listen)
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else {
  listen();
}

function listen () {
  const options = {
    key: fs.readFileSync('certs/store.key'),
    cert: fs.readFileSync('certs/store.crt')
  };

  https
    .createServer(options, nuxt.render)
    .listen(port, host);
  console.log('Server listening on `localhost:' + port + '`.');
}
