import express from 'express';
import passport from 'passport';
import { setTokenCookie } from '../../middleware/auth.middleware';

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

export default router;
