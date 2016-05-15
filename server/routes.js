/**
 * Routes for express app
 */
import api  from './api/api.index';
import auth from './modules/auth/auth.index';
import NotFoundErrorHandler from './modules/errors/notFoundErrorHandler';

export default (app) => {
  app.use('/api',  api);
  app.use('/auth', auth);

  // No existing routes
  app.all('/404', NotFoundErrorHandler.handle);
  app.all('/*', (req, res) => res.redirect('/404'));
};
