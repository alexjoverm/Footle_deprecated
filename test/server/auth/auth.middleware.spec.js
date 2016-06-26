const appRoot = require('app-root-path').path;
const authPath = `${appRoot}/server/modules/auth`;
const proxyquire = require('proxyquire').noPreserveCache();

// Mock the auth/middleware.js file
const middleware = proxyquire(`${authPath}/middleware`, {
  'express-jwt': sinon.spy()
});

describe('Auth middleware: ', () => {
  it('should exists: isAuthenticated', () => {
    expect(middleware.isAuthenticated).to.exist;
  });

  it('should exists: signToken', () => {
    expect(middleware.signToken).to.exist;
  });

  it('should exists: setTokenCookie', () => {
    expect(middleware.setTokenCookie).to.exist;
  });
});
