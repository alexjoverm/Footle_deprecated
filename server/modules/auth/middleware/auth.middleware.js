import jwt         from 'jsonwebtoken';
import expressJwt  from 'express-jwt';
import compose     from 'composable-middleware';
import User        from '~/server/modules/auth/user/user.model';
import config      from '~/server/config/users';

console.log(process.env.SESSION_SECRET);
const validateJwt = expressJwt({ secret: process.env.SESSION_SECRET });


/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
  return compose()
    // Validate jwt
    .use((req, res, next) => {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = `Bearer ${req.query.access_token}`;
      }

      validateJwt(req, res, next);
    })
    // Attach user to request
    .use((req, res, next) => {
      User.findById(req.user._id).exec()
        .then(user => {
          if (!user) {
            return res.status(401).end();
          }
          req.user = user;
          next();
        })
        .catch(err => next(err));
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => {
      // Simple way, we check role is equal or higher level than the required
      if (config.roles.indexOf(req.user.role) >= config.roles.indexOf(roleRequired)) {
        next();
      } else {
        res.status(403).send('Forbidden');
      }
    });
}

// /**
//  * Checks if current User is saved on local strategy
//  */

// export function isLocalStrategy() {
//   return compose().use((req, res, next) => {
//     User.findById(req.params.id, (err, user) => {
//       if (!user) return res.send(401);

//       if (user.provider === 'local') {
//         next();
//       } else {
//         res.send(400, 'Only can change password on local strategy');
//       }
//     });
//   });
// }


/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, role) {
  // return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
  return jwt.sign({ _id: id, role }, process.env.SESSION_SECRET);
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  const token = signToken(req.user._id, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
}
