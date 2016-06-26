const compose = require('composable-middleware');
const appRoot = require('app-root-path').path;
const User    = require(`${appRoot}/server/api/users/user.model`);
const auth    = require(`${appRoot}/server/modules/auth/middleware`);
const config  = require(`${appRoot}/server/config/users`);

exports.isAuthenticatedAttach = () =>
  compose()
    .use(auth.isAuthenticated)
    .use(this.attachUser);

/**
 * Attach user object to the request
 */
exports.attachUser = (req, res, next) => {
  User.findById(req.user._id).exec()
  .then(user => {
    if (!user) {
      return res.status(401).end();
    }
    req.user = user; // eslint-disable-line no-param-reassign
    next();
  })
  .catch(err => next(err));
};

/**
 * Checks if the user role meets the minimum requirements of the route
 */
exports.hasRole = (roleRequired) => {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(this.isAuthenticatedAttach())
    .use((req, res, next) => {
      // Simple way, we check role is equal or higher level than the required
      if (config.roles.indexOf(req.user.role) >= config.roles.indexOf(roleRequired)) {
        next();
      } else {
        res.status(403).send('Forbidden');
      }
    });
};

// /**
//  * Checks if current User is saved on local strategy
//  */

// exports.isLocalStrategy => ( {
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
