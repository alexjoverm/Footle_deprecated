const express   = require('express');
const passport  = require('passport');
const signToken = require('../../middleware').signToken;

const router = express.Router();

/**
 * Authenticate on local database
 * @route /auth/
 */
router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    const error = err || info;
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res.status(404).json({ message: 'Something went wrong, please try again.' });
    }
    const token = signToken(user._id, user.role);
    res.json({ token });
  })/*(req, res, next)*/;
});

module.exports = router;
