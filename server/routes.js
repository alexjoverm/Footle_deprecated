/**
 * Routes for express app
 */
import api  from './api';
import auth from './modules/auth';

export default (app) => {
  app.use('/api',  api);
  app.use('/auth', auth);
};
