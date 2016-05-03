import express        from 'express';
import passport       from 'passport';
import session        from 'express-session';
import bodyParser     from 'body-parser';
import path           from 'path';
import flash          from 'express-flash';
import methodOverride from 'method-override';
import connectMongo   from 'connect-mongo';
import mongoose       from 'mongoose';

export default (app) => {
  app.set('port', (process.env.PORT || 3000));

  // X-Powered-By header has no functional value.
  // Keeping it makes it easier for an attacker to build the site's profile
  // It can be removed safely
  app.disable('x-powered-by');

  // Views
  app.set('view engine', 'ejs');
  app.use(compression()); // Compress using gzip to improve performance

  // Request Related stuff
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(methodOverride());

  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../..', 'public')));

  // Session
  const mongoStore = connectMongo(session);
  const sess = {
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    proxy: true, // The "X-Forwarded-Proto" header will be used.
    name: 'sessionId',
    // Add HTTPOnly, Secure attributes on Session Cookie
    // If secure is set, and you access your site over HTTP, the cookie will not be set
    cookie: {
      httpOnly: true,
      secure: false,
    },
    store: new mongoStore({ mongoose_connection: mongoose.connection })
  };

  console.log('--------------------------');
  console.log('===> 😊  Starting Server . . .');
  console.log(`===>  Environment: ${process.env.NODE_ENV}`);
  console.log(`===>  Listening on port: ${process.env.PORT}`);

  /**
   * Important to keep this in mind
   */
  if (process.env.NODE_ENV === 'production') {
    console.log('===> 🚦  Note: In order for authentication to work in production');
    console.log('===>           you will need a secure HTTPS connection');
    sess.cookie.secure = true; // Serve secure cookies
    app.use(favicon(path.join('../..', 'public', 'favicon.ico')));
  }
  console.log('--------------------------');

  app.use(session(sess));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());
};
