const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const { index } = require('./config/static.json');
const { apps: [ { env: { PORT } } ] } = require('./config/pm2.json');

const app = new Koa();

app.use( serve( path.resolve(__dirname, index), { extensions: ['html'] } ));

app.listen(PORT);

console.log(`Server is running at ${PORT}`);