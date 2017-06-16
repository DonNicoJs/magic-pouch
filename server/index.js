const Hapi = require('hapi');
const Inert = require('inert');
const jwtAuth = require('hapi-auth-jwt2');
const HAPIWebSocket = require('hapi-plugin-websocket');
const fs = require('fs');
const p = require('path');
const crypto = require('crypto');

const models = require('./models');

const handlers = {
  users: require('./controllers/users')
};

// create the server
const server = new Hapi.Server();

server.connection({host: '127.0.0.1', port: 9010, routes: { cors: true }});

server.register([Inert, jwtAuth, HAPIWebSocket], () => {});

const secretKey = require('./secret');

server.auth.strategy('jwt', 'jwt', true,
  { key: secretKey,
    validateFunc: function (request, session, callback) {
      cache.get(request.token, (err, cached) => {
        if (err) {
          return callback(err, false);
        }

        if (!cached) {
          return callback(null, false);
        }

        return callback(null, true, cached.user);
      });
    },
    verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
  });

const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
const peersCache = {};
server.app.cache = cache;

server.route({
  method: 'POST',
  path: '/api/login/',
  config: {
    handler: handlers.users.login,
    auth: {mode: 'try'}
  }
});

const taskApi = ['users'];

taskApi.forEach(apiName => {
  const postConfig = {
    method: 'POST',
    path: `/api/${apiName}/`,
    config: {
      handler: handlers[apiName].create
    }
  };
  if (apiName === 'users') {
    postConfig.config.auth = false;
  }
  server.route(postConfig);

  server.route({
    method: 'GET',
    path: `/api/${apiName}/`,
    handler: handlers[apiName].all
  });

  server.route({
    method: 'GET',
    path: `/api/${apiName}/{id}`,
    handler: handlers[apiName].find
  });
});

server.route({
  method: 'GET',
  path: '/api/mentored',
  handler: handlers.users.mentored
});

server.route({
  method: 'POST',
  path: '/api/send-file',
  config: {
    payload: {
      output: 'stream',
      maxBytes: 10485760,
      parse: true,
      allow: 'multipart/form-data'
    },
    auth: false,
    handler: (req, res) => {
      const data = req.payload;
      if (data.file) {
        const name = data.file.hapi.filename;
        const path = p.join(__dirname, '/uploads/', name);
        const output = fs.createWriteStream(path);

        const cipher = crypto.createCipher('aes-256-cbc', data.uuid);

        output.on('error', err => {
          console.error(err);
        });

        data.file.pipe(cipher).pipe(output);

        data.file.on('end', () => {
          const path = `/uploads/${data.file.hapi.filename}/${data.uuid}/`;
          const fileName = data.file.hapi.filename;
          const ctx = peersCache[data.uuid];
          ctx.ws.send(JSON.stringify({mutation: 'FILE_ADDED', namespace: 'ws', data: {fileName, path}}));
          res();
        });
      }
    }
  }
});

server.route({
  method: 'POST',
  path: '/pouch',
  config: {
    plugins: {
      websocket: {
        only: true,
        initially: false,
        connect: ({ ctx, ws }) => {
          ctx.ws = ws;
          ctx.to = setInterval(() => {
            ws.send(JSON.stringify({ cmd: 'PING' }));
          }, 5000);
        },
        disconnect: ({ ctx }) => {
          if (ctx.to !== null) {
            clearTimeout(ctx.to);
            ctx.to = null;
          }
        }
      }
    },
    auth: false
  },
  handler: (request, reply) => {
    const ctx = request.websocket().ctx;
    const uuid = request.payload.uuid;
    peersCache[uuid] = ctx;
    reply({mutation: 'LINK_ESTABLISHED', namespace: 'ws'});
  }
});

server.route({
  method: 'GET',
  path: '/uploads/{pic}/{uuid}/',
  config: {
    auth: false,
    handler: (req, res) => {
      const decipher = crypto.createDecipher('aes-256-cbc', req.params.uuid);
      const path = p.join(__dirname, '/uploads/', req.params.pic);
      const input = fs.createReadStream(path);
      res(input.pipe(decipher)).header('Content-disposition', 'attachment; filename=' + req.params.pic);
    }
  }
});

models.sequelize.sync().then(function () {
  server.start(function () {
    console.log('Running on 9010');
  });
});
