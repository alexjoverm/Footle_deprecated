
const express = require('express');
const appRoot =  require('app-root-path').path;
const User    = require(`${appRoot}/server/api/users/user.model`);

// Passport Configuration
require('./strategies/local/passport').setup(User);
// require('./strategies/facebook/passport').setup(User);
// require('./strategies/google/passport').setup(User);
// require('./strategies/twitter/passport').setup(User);

const router = express.Router();

/**
 * @route /auth
 */
router.use('/', require('./strategies/local'));
// router.use('/facebook', require('./strategies/facebook').default);
// router.use('/twitter', require('./strategies/twitter').default);
// router.use('/google', require('./strategies/google').default);

module.exports = router;
