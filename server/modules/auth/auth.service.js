import jwt         from 'jsonwebtoken';
import expressJwt  from 'express-jwt';
import compose     from 'composable-middleware';
import User        from 'server/models/user/user.model';
import config      from 'server/config/users';

const validateJwt = expressJwt({ secret: process.env.SESSION_SECRET });


/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use((req, res, next) => {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token'))
        req.headers.authorization = 'Bearer ' + req.query.access_token;

      validateJwt(req, res, next);
    })
    // Attach user to request
    .use((req, res, next) => {
      User.findById(req.user._id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.send(401);

        req.user = user;
        next();
      });
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => {
      // Simple way, we check role is equal or higher level than the required
      if (config.roles.indexOf(req.user.role) >= config.roles.indexOf(roleRequired)) {
        next();
      } else {
        res.send(403);
      }
    });
}

/**
 * Checks if current User is saved on local strategy
 */

function isLocalStrategy() {
  return compose().use((req, res, next) => {
    User.findById(req.params.id, (err, user) => {
      if (!user) return res.send(401);

      if (user.provider === 'local') {
        next();
      } else {
        res.send(400, 'Only can change password on local strategy');
      }
    });
  });
}


/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id /* , role*/) {
  // return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
  return jwt.sign({ _id: id }, process.env.SESSION_SECRET);
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.' });
  const token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

export {
  isAuthenticated,
  hasRole,
  signToken,
  setTokenCookie,
  isLocalStrategy
};
