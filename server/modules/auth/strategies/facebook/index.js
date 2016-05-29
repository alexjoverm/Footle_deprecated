const express        = require('express');
const passport       = require('passport');
const setTokenCookie = require('../../middleware').setTokenCookie;

const router = express.Router();

/**
 * Authenticate on facebook
 * @route /auth/facebook
 */
router
  .get('/', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signup',
    session: false
  }))
  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup',
    session: false
  }), setTokenCookie);

module.exports = router;
