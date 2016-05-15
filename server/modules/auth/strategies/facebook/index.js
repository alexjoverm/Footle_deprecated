import express from 'express';
import passport from 'passport';
import { setTokenCookie } from '../../middleware/auth.middleware';

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

export default router;
