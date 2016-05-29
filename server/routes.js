/**
 * Routes for express app
 */
const api  = require('./api');
const auth = require('./modules/auth');
const NotFoundErrorHandler = require('./modules/errors/NotFoundErrorHandler');

module.exports = (app) => {
  app.use('/api',  api);
  app.use('/auth', auth);


  // No existing routes
  app.all('/404', NotFoundErrorHandler.handle);
  app.all('/*', (req, res) => res.redirect('/404'));
};
