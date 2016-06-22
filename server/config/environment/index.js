const _ = require('lodash');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  require('./shared'),
  require(`./${process.env.NODE_ENV}.js`));
