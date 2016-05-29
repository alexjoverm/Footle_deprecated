const express        = require('express');
const passport       = require('passport');
const setTokenCookie = require('../../middleware').setTokenCookie;

const router = express.Router();

/**
 * Authenticate on google
 * @route /auth/google
 */
router
  .get('/', passport.authenticate('google', {
    failureRedirect: '/signup',
    scope: [
      'profile',
      'email'
    ],
    session: false
  }))
  .get('/callback', passport.authenticate('google', {
    failureRedirect: '/signup',
    session: false
  }), setTokenCookie);

module.exports = router;
