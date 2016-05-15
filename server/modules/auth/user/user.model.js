/* eslint-disable no-underscore-dangle */
import mongoose          from 'mongoose';
import crypto            from 'crypto';
import { authProviders } from '../auth.config';
import Logger            from '~/server/modules/utils/logger';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, lowercase: true },
  password: String,
  image: String,
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {}
});

// Public profile information
UserSchema
  .virtual('profile')
  .get(() => ({ name: this.name, role: this.role }));

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(() => ({ _id: this._id, role: this.role }));


/**
 * Validations
 */
// Validate empty name
UserSchema
  .path('name')
  .validate(name => {
    if (authProviders.includes(this.provider)) return true;
    return name.length;
  }, 'Name cannot be blank');

// Validate empty email
UserSchema
  .path('email')
  .validate(email => {
    if (authProviders.includes(this.provider)) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(password => {
    if (authProviders.includes(this.provider)) return true;
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate((value, respond) =>
     this.constructor.findOne({ email: value }).exec()
      .then((user) => {
        // If there is no user, then the email is available
        new Logger().log(`user.id: ${user && user.id}, this.id: ${this.id}`);
        if (/* user && this.id === user.id || */!user) {
          return respond(true); //
        }
        return respond(false);
      })
      .catch((err) => {
        throw err;
      })
  , 'The specified email address is already in use.');


const validatePresenceOf = (value) => value && value.length;
/**
 * Pre-save hook
 */
UserSchema
  .pre('save', (next) => {
    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next();
    }

    if (!validatePresenceOf(this.password)) {
      if (!authProviders.includes(this.provider)) {
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
   * @param {String} plainText
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
      }
      callback(null, false);
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
  makeSalt(callback) {
    const byteSize = 16;

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

export default mongoose.model('User', UserSchema);
