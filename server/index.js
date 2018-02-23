const Hapi = require('hapi');
const HAPIWebSocket = require('hapi-plugin-websocket');
const fs = require('fs-extra');
const p = require('path');
const crypto = require('crypto');


// create the server
const server = new Hapi.Server();

server.connection({host: '127.0.0.1', port: 9010, routes: { cors: false }});

server.register([HAPIWebSocket], () => {});

const cache = server.cache({ segment: 'sessions', expiresIn: 60 * 60 * 1000 });
const peersCache = {};
server.app.cache = cache;

server.route({
  method: 'POST',
  path: '/api/send-file',
  config: {
    payload: {
      output: 'stream',
      maxBytes: 200485760,
      parse: true,
      allow: 'multipart/form-data'
    },
    handler: (req, res) => {
      const data = req.payload;

      const hash = crypto.createHash('sha256').update('' + data.uuid).digest('hex');
      const ctx = peersCache[hash];
      if (!ctx) {
        res({code: 1, message: 'Invalid uuid'}).code(400);
      } else if (data.file) {
        const storedName = crypto.createHash('sha256').update(data.file.hapi.filename).digest('hex');
        const path = p.join(__dirname, '/uploads/', storedName);
        const output = fs.createWriteStream(path);

        const cipher = crypto.createCipher('aes-256-cbc', data.uuid);

        output.on('error', err => {
          console.error(err);
          res('Error saving the file').code(500);
        });

        data.file.pipe(cipher).pipe(output);
        data.file.on('end', () => {
          const path = `/uploads/${data.file.hapi.filename}/`;
          const fileName = data.file.hapi.filename;
          ctx.files.push(storedName);
          ctx.ws.send(JSON.stringify({mutation: 'FILE_ADDED', namespace: 'ws', data: {fileName, path}}));
          res();
        });
      }
    }
  }
});

function deleteFiles(files) {
  files.forEach(name => {
    const path = p.join(__dirname, '/uploads/', name);
    fs.unlink(path);
  });
}

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
          ctx.files = [];
          ctx.to = setInterval(() => {
            ws.send(JSON.stringify({ cmd: 'PING' }));
          }, 5000);
        },
        disconnect: ({ ctx }) => {
          if (ctx.to !== null) {
            clearTimeout(ctx.to);
            deleteFiles(ctx.files);
            ctx.to = null;
            ctx.ws = null;
          }
        }
      }
    }
  },
  handler: (request, reply) => {
    const ctx = request.websocket().ctx;
    const uuid = request.payload.uuid;
    const hash = crypto.createHash('sha256').update(''+ uuid).digest('hex');
    peersCache[hash] = ctx;
    reply({mutation: 'LINK_ESTABLISHED', namespace: 'ws'});
  }
});

server.route({
  method: 'GET',
  path: '/uploads/{pic}/{uuid}/',
  config: {
    handler: (req, res) => {
      const decipher = crypto.createDecipher('aes-256-cbc', req.params.uuid);
      const storedName = crypto.createHash('sha256').update(req.params.pic).digest('hex');
      const path = p.join(__dirname, '/uploads/', storedName);
      const input = fs.createReadStream(path);
      res(input.pipe(decipher)).header('Content-disposition', 'attachment; filename=' + req.params.pic + '; filename*=UTF-8\'\'' + req.params.pic);
    }
  }
});

server.start(function () {
  const path = p.join(__dirname, '/uploads/');
  fs.removeSync(path)
  fs.mkdirSync(path);
  console.log('Running on 9010');
});
