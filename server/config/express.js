const express        = require('express');
const mongoose       = require('mongoose');
const morgan         = require('morgan');
const errorHandler   = require('errorhandler');
const passport       = require('passport');
const session        = require('express-session');
const bodyParser     = require('body-parser');
const path           = require('path');
const flash          = require('express-flash');
const methodOverride = require('method-override');
const connectMongo   = require('connect-mongo');
const compression    = require('compression');
const cookieParser   = require('cookie-parser');
const appRoot    = require('app-root-path');

module.exports = (app) => {
  app.set('port', process.env.PORT);

  // X-Powered-By header has no functional value.
  // Keeping it makes it easier for an attacker to build the site's profile
  // It can be removed safely
  app.disable('x-powered-by');
  // Views
  app.set('view engine', 'ejs');
  app.use(compression()); // Compress using gzip to improve performance

  // Request Related stuff
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); // To parse application/x-www-form-urlencoded
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());


  // Session
  const MongoStore = connectMongo(session);
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
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  };

  app.use(session(sess));
  app.use(flash());

  app.use(express.static(path.join(appRoot.path, 'public')));

  console.log('--------------------------');
  console.log('===> 😊  Starting Server . . .');
  console.log(`===>  Environment: ${process.env.NODE_ENV}`);
  console.log(`===>  Listening on port: ${process.env.PORT}`);

  if (process.env.NODE_ENV === 'production') {
    console.log('===> 🚦  Note: In order for authentication to work in production');
    console.log('===>           you will need a secure HTTPS connection');
    sess.cookie.secure = true; // Serve secure cookies
    // app.use(favicon(path.join(appRoot, 'public', 'favicon.ico')));
    app.use(morgan('dev'));
  } else {
    app.use(morgan('dev'));
    app.use(errorHandler());
  }
  console.log('--------------------------');
};
