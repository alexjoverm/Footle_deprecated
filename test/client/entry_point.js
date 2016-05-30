const testsContext = require.context('.', true, /.js$/);
testsContext.keys().forEach(testsContext);
module.exports = testsContext;
