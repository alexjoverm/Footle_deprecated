const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

exports.setup = User => {
  passport.use(new GoogleStrategy({
    clientID: process.env.PASSPORT_ID,
    clientSecret: process.env.PASSPORT_SECRET,
    callbackURL: process.env.PASSPORT_CALLBACK
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ 'google.id': profile.id }).exec()
      .then(user => {
        if (user) {
          return done(null, user);
        }

        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          username: profile.emails[0].value.split('@')[0],
          provider: 'google',
          google: profile._json
        });
        user.save()
          .then(userResult => done(null, userResult))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
