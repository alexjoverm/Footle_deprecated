const appRoot   = require('app-root-path').path;
const app = require(`${appRoot}/server`);
const httpMocks = require('node-mocks-http');

const middleware = require(`${appRoot}/server/modules/auth/middleware`);

describe('Auth middleware integration:', () => {
  let acessToken;

  describe('signToken', () => {
    it('return acessToken', () => {
      acessToken = middleware.signToken('hello', 'admin');

      // HMAC-SHA256 returns a 144 length hash for a given input of 10 characters (hello + admin)
      expect(acessToken).to.have.length(144);
    });
  });

  describe('isAuthenticated', () => {
    // Wrap call to chai.connect into a function to use params and return a Promise
    const mockedMiddleware = (changeSecret) => {
      let oldToken;
      if (changeSecret) {
        oldToken = acessToken;
        acessToken = 'blabalblalba';
      }

      return new Promise((resolve, reject) => {
        connect.use(middleware.isAuthenticated)
          .req(req => {
            req.query = { access_token: acessToken };
          })
          .next((res) => {
            acessToken = oldToken;
            if (res && res.status === 401) {
              reject(res.message);
            } else {
              resolve();
            }
          })
          .dispatch();
      });
    };

    it('should validate correctly', () =>
      mockedMiddleware().should.be.fulfilled
    );

    it('should not validate', () =>
      mockedMiddleware(true).should.be.rejected
    );
  });

  describe('setTokenCookie', () => {
    it('sets cookie in the res object', () => {
      const req  = httpMocks.createRequest({
        user: { _id: 111, role: 'admin' }
      });
      const res = httpMocks.createResponse();

      middleware.setTokenCookie(req, res);
      expect(res.cookies.token).to.exist;
    });
  });
});
