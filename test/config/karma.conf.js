const path = require('path');
const webpack = require('webpack');

module.exports = (config) => {
  config.set({
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['jsdom'],

    frameworks: ['mocha', 'chai', 'sinon-chai', 'chai-as-promised', 'chai-things'],

    // Point karma at testing files
    files: [
      //'test/client/entry_point.js',
      'test/**/*.spec.js',

    ],

    // Run karma through preprocessor plugins
    preprocessors: {
      'test/client/entry_point.js': [ 'webpack', 'sourcemap' ]
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,
    colors: true,

    // How long will Karma wait for a message from a browser before disconnecting
    // from it (in ms).
    browserNoActivityTimeout: 10000,

    webpack: {
      devtool: 'inline-source-map',
      context: path.join(__dirname, "app"),
      module: {
        loaders: [
          {
            test: /\.js$|\.jsx$/,
            loader: 'babel',
            // Reason why we put this here instead of babelrc
            // https://github.com/gaearon/react-transform-hmr/issues/5#issuecomment-142313637
            query: {
              "presets": ["es2015", "react", "stage-0"],
              "plugins": [
                "transform-react-remove-prop-types",
                "transform-react-constant-elements",
                "transform-react-inline-elements"
              ]
            },
            include: path.join(__dirname, 'app'),
            exclude: path.join(__dirname, '/node_modules/')
          },
          { test: /\.json$/, loader: "json-loader" },
          { test: /\.css$/, loader: "null-loader" }
        ],
      },
      resolve: {
        extensions: ['', '.js', '.jsx', '.css'],
        modulesDirectories: [
          'app', 'node_modules'
        ]
      },
      node: {
        fs: "empty"
      },
      watch: true
    },

    webpackMiddleware: {
        // webpack-dev-middleware configuration
        noInfo: true
    },

    webpackServer: {
      noInfo: true // Do not spam the console when running in karma
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage',
    // 'mocha' (added in plugins)
    reporters: ['mocha'],

    // client: {
      mocha: {
        require: 'mocha.conf.js'
      },
    // },

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
  });
};
