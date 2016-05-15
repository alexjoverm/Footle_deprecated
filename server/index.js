import express          from 'express';
import webpack          from 'webpack';
import {}               from 'dotenv/config';
import databaseConfig   from './config/database';
import expressConfig    from './config/express';
import routesConfig     from './routes';
import webpackDevConfig from '../webpack/webpack.config.dev';

const app = express();


/** Setup database */
 // databaseConfig();


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
