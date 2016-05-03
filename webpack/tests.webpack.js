// require.context(directory, useSubdirectories = false, regExp = /^\.\//)
const context = require.context('../app', true, /-test.js$/);
context.keys().forEach(context);
