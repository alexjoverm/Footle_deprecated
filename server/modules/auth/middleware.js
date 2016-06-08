const jwt         = require('jsonwebtoken');
const expressJwt  = require('express-jwt');
console.log("=========");
console.log(process.env.SESSION_SECRET);
console.log("=========");
const validateJwt = expressJwt({ secret: process.env.SESSION_SECRET });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
exports.isAuthenticated = (req, res, next) => {
    // allow access_token to be passed through query parameter as well
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = `Bearer ${req.query.access_token}`;
    }
    validateJwt(req, res, next);
};

/**
 * Returns a jwt token signed by the app secret
 */
exports.signToken = (id, role) =>
  // return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
  jwt.sign({ _id: id, role }, process.env.SESSION_SECRET);

/**
 * Set token cookie directly for oAuth strategies
 * Requires user object in the request
 */
exports.setTokenCookie = (req, res) => {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  const token = this.signToken(req.user._id, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
};
