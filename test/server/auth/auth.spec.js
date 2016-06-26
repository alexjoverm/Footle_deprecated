const appRoot = require('app-root-path').path;
const authPath = `${appRoot}/server/modules/auth`;
const proxyquire = require('proxyquire');
const expressJwt  = require('express-jwt');

// Stub the API endpoints by empty sinnon stubs
const routerStub = {
  use: sinon.spy(),
  post: sinon.spy()
};


function aux() {}
aux['@global'] = true;

const authStub = {
  express: { // Mock express.Router
    Router: () => routerStub
  },
  './strategies/local/passport': {
    setup: sinon.spy()
  },
  'express-jwt': aux
};

// Mock the auth/index.js file
const auth = proxyquire(`${authPath}/index`, authStub);

describe('Auth module: ', () => {
  after(() => { authStub['express-jwt'] = expressJwt; });

  it('should return an express router instance', () => {
    expect(auth).to.equal(routerStub);
  });


  describe('Setup: ', () => {
    it('local auth', () => {
      expect(authStub['./strategies/local/passport'].setup
        .withArgs(sinon.match.any)).to.have.been.calledOnce;
    });
    xit('facebook auth', () => {
      expect(authStub['./strategies/facebook/passport'].setup
        .withArgs(sinon.match.any)).to.have.been.calledOnce;
    });
    xit('google auth', () => {
      expect(authStub['./strategies/google/passport'].setup
        .withArgs(sinon.match.any)).to.have.been.calledOnce;
    });
    xit('twitter auth', () => {
      expect(authStub['./strategies/twitter/passport'].setup
        .withArgs(sinon.match.any)).to.have.been.calledOnce;
    });
  });


  describe('Auth module: ', () => {
    it('POST /', () => {
      expect(routerStub.use.withArgs('/', sinon.match.any)).to.have.been.calledOnce;
    });
    xit('GET /facebook', () => {
      expect(routerStub.use.withArgs('/facebook', sinon.match.any)).to.have.been.calledOnce;
    });
    xit('GET /google', () => {
      expect(routerStub.use.withArgs('/google', sinon.match.any)).to.have.been.calledOnce;
    });
    xit('GET /twitter', () => {
      expect(routerStub.use.withArgs('/twitter', sinon.match.any)).to.have.been.calledOnce;
    });
  });
});
