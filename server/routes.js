/**
 * Routes for express app
 */
import api  from './api';
import auth from './modules/auth';
import NotFoundErrorHandler from './modules/errors/NotFoundErrorHandler';

export default (app) => {
  app.use('/api',  api);
  // app.use('/auth', auth);

  // No existing routes
  app.all('/404', NotFoundErrorHandler.handle);
  app.all('/*', (req, res) => res.redirect('/404'));
};
