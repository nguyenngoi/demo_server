const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
// const serve = require('koa-static');
// const routes = require('./routes');
const Socket = require('./socket');

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
const io = new Socket(server);

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

