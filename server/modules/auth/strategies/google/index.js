import express from 'express';
import passport from 'passport';
import { setTokenCookie } from '../../middleware/auth.middleware';

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

export default router;
