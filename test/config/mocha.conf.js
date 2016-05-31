/**
 * Conf for mocha running on server nodejs. For a browser conf:
 *  - Use window instead of global
 *  - Use karma-chai and so on instead of require(chai) or chai.use
 *  - Karma runs ONLY in browser
 */

// Register the Babel require hook
//require('babel-core/register')

const chai = require('chai');

// Load Chai assertions
global.expect = chai.expect;
global.assert = chai.assert;
chai.should();

// Load Sinon
global.sinon = require('sinon');

// Initialize Chai plugins
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));
chai.use(require('chai-things'));
