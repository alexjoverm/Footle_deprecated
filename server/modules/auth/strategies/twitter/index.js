const express = require('express');
const passport = require('passport');
const setTokenCookie = require('../../middleware').setTokenCookie;

const router = express.Router();

/**
 * Authenticate on twitter
 * @route /auth/twitter
 */
router
  .get('/', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false
  }))
  .get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false
  }), setTokenCookie);

module.exports = router;
