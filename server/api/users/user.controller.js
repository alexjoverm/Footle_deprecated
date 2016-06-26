const User = require('./user.model');
const jwt = require('jsonwebtoken');

function validationError(res, statusCode = 422) {
  return (err) => res.status(statusCode).json(err);
}

function handleError(res, statusCode = 500) {
  return (err) => res.status(statusCode).send(err);
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = (req, res) =>
   User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));

/**
 * Creates a new user
 */
exports.create = function (req, res) {
  const newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.SESSION_SECRET
        // { expiresIn: 60 * 60 * 5 }
      );
      res.json({ token });
    })
    .catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = (req, res, next) => {
  const userId = req.params.id;

  return User.findById(userId).exec().then(user => {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profile);
  })
  .catch(err => next(err));
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = (req, res) =>
  User.findByIdAndRemove(req.params.id).exec()
    .then(() => {
      res.status(204).end();
    })
    .catch(handleError(res));

/**
 * Change a users password
 */
exports.changePassword = (req, res, next) => {
  const userId = req.user._id;
  const oldPass = String(req.body.oldPassword);
  const newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      }
      return res.status(403).end();
    })
    .catch(err => next(err));
};

/**
 * Get my info
 */
exports.me = (req, res, next) => {
  const userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
};

/**
 * Authentication callback
 */
exports.authCallback = (req, res) => {
  res.redirect('/');
};
