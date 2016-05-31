const path = require('path');
const appRoot = require('app-root-path').path;
const authPath = `${appRoot}/server/modules/auth`;
const proxyquire = require('proxyquire').noPreserveCache();

// Stub the API endpoints by empty sinnon stubs
const routerStub = {
  use: sinon.spy(),
  post: sinon.spy()
};

function aux () {}
aux['@global'] = true;

const authStub = {
  express: { // Mock express.Router
    Router: function() {
      return routerStub;
    }
  },
  './strategies/local/passport': {
    setup: sinon.spy()
  },
  'express-jwt': aux
};

// Mock the auth/index.js file
const auth = proxyquire(`${authPath}/index`, authStub);

describe('Auth module: ', () => {

  it('should return an express router instance', () => {
    expect(auth).to.not.equal(routerStub);
  });

});
