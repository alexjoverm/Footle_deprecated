import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

export function setup(User) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: [
      'displayName',
      'emails'
    ]
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ 'facebook.id': profile.id }).exec()
      .then(user => {
        if (user) {
          return done(null, user);
        }

        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          provider: 'facebook',
          facebook: profile._json
        });
        user.save()
          .then(userResult => done(null, userResult))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
