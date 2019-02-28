const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
// const serve = require('koa-static');
// const routes = require('./routes');

const app = new Koa();
const config = {
  port: 8080,
  host: 'localhost',
}

app.use(cors())
  .use(bodyParser({
    enableTypes: ['json', 'form'],
    jsonLimit: '1mb',
    textLimit: '1mb',
    strict: true,
    onerror: (err, ctx) => {
      ctx.throw('body parser error', 442)
    }
  }))
// .use(serve(`${__dirname}/public`));
// .use(routes.routes())
// .use(routes.allowedMethods());

const server = http.createServer(app.callback());
const io = require('socket.io')(server);
io
  .of('/socket')
  .on('connection', socket => {
    console.log('client connection')
    socket.emit('Hello')
    socket.on('on', data => {
      console.log(data, 'data on socket')
      socket.emit(data)
    })
    socket.on('off', data => {
      console.log(data, 'data on socket')
      socket.emit(data)
    })
    socket.on('disconnect', () => {
      // disconnect socket
    })
  })

server.listen(process.env.PORT || config.port, err => {
  try {
    if (err) {
      console.debug('Server listen error');
      console.error(err);
    }
    console.info(`Server start listen ${config.host}:${config.port}`);
    console.info(`Process PID: ${process.pid}`);
  } catch (error) {
    console.error(error)
    return process.exit(1);
  }
})

