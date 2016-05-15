import express from 'express';
import User from './user/user.model';

// Passport Configuration
require('./strategies/local/passport').setup(User);
// require('./strategies/facebook/passport').setup(User);
// require('./strategies/google/passport').setup(User);
// require('./strategies/twitter/passport').setup(User);

const router = express.Router();

/**
 * @route /auth
 */
router.use('/local', require('./strategies/local').default);
// router.use('/facebook', require('./strategies/facebook').default);
// router.use('/twitter', require('./strategies/twitter').default);
// router.use('/google', require('./strategies/google').default);

export default router;
