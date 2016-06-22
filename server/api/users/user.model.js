const crypto = require('crypto');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const appRoot   = require('app-root-path').path;
const { authTypes } = require(`${appRoot}/server/config/users`);

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    lowercase: true,
    required() {
      if (!authTypes.includes(this.provider)) {
        return true;
      }

      return false;
    }
  },
  role: {
    type: String,
    default: 'user'
  },
  password: {
    type: String,
    required() {
      if (!authTypes.includes(this.provider)) {
        return true;
      }

      return false;
    }
  },
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {}
});

/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      name: this.name,
      role: this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      _id: this._id,
      role: this.role
    };
  });

/**
 * Validations
 */

const validatePresenceOf = value => value && value.length;

// Validate empty email
UserSchema
  .path('email')
  .validate(function (email) {
    if (authTypes.includes(this.provider)) {
      return true;
    }
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function (password) {
    if (authTypes.includes(this.provider)) {
      return true;
    }
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function (value, respond) {
    const self = this;
    if (authTypes.includes(this.provider)) {
      return respond(true);
    }
    return this.constructor.findOne({ email: value }).exec()
      .then(function (user) {
        if (!user || user && self.id === user.id) {
          return respond(true);
        }

        return respond(false);
      })
      .catch(function (err) {
        throw err;
      });
  }, 'The specified email address is already in use.');

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next();
    }

    if (!validatePresenceOf(this.password)) {
      if (authTypes.includes(this.provider)) {
        return next(new Error('Invalid password'));
      }
      return next();
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if (saltErr) {
        return next(saltErr);
      }
      this.salt = salt;
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if (encryptErr) {
          return next(encryptErr);
        }
        this.password = hashedPassword;
        next();
      });
    });
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} byteSize Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(...args) {
    const defaultByteSize = 16;
    let byteSize;
    let callback;

    if (typeof args[0] === 'function') {
      callback = args[0];
      byteSize = defaultByteSize;
    } else if (typeof args[1] === 'function') {
      callback = args[1];
    } else {
      throw new Error(`Params not correct.
        You must provide a byteSize:Number and a callback:Function`);
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    if (!callback) {
      return crypto.randomBytes(byteSize).toString('base64');
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        callback(err);
      }
      callback(null, salt.toString('base64'));
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (callback) {
        return callback('Missing password or salt');
      }
      return null;
    }

    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                   .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
      if (err) {
        callback(err);
      }
      callback(null, key.toString('base64'));
    });
  }
};

module.exports = mongoose.model('User', UserSchema);
