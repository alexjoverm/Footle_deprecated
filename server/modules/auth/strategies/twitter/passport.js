import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';

export function setup(User) {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_ID,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK,
  },
  (token, tokenSecret, profile, done) => {
    User.findOne({ 'twitter.id': profile.id }).exec()
      .then(user => {
        if (user) {
          return done(null, user);
        }

        user = new User({
          name: profile.displayName,
          username: profile.username,
          role: 'user',
          provider: 'twitter',
          twitter: profile._json
        });
        user.save()
          .then(userResult => done(null, userResult))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
