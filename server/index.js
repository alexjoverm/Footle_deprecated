require('dotenv').config();

const express          = require('express');
const webpack          = require('webpack');
const databaseConfig   = require('./config/database');
const expressConfig    = require('./config/express');
const routesConfig     = require('./routes');
const webpackDevConfig = require('../webpack/webpack.config.dev');

const app = express();

/** Setup database */
databaseConfig();

/** Setup Webpack */
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackDevConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackDevConfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

/*
 * Bootstrap application settings
 */
expressConfig(app);
routesConfig(app);

app.listen(process.env.PORT, () => {
  console.log(`The server is running at http://localhost:${process.env.PORT}/`);
});

module.exports = app;
