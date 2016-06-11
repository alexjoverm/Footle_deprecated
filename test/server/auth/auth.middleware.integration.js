const appRoot   = require('app-root-path').path;
const app       = require(`${appRoot}/server`);
const httpMocks = require('node-mocks-http');

//process.env.SESSION_SECRET = "kj32b23lk";
const middleware = require(`${appRoot}/server/modules/auth/middleware`);
const request    = require('supertest');



describe('Auth middleware integration:', () => {

  let access_token;

  describe('signToken', () => {

    it('return access_token', () => {
      access_token = middleware.signToken('hello', 'admin');

      // HMAC-SHA256 returns a 144 length hash for a given input of 10 characters (hello + admin)
      expect(access_token).to.have.length(144);
    });

  });

  describe('isAuthenticated', () => {

    // Wrap call to chai.connect into a function to use params and return a Promise
    let mockedMiddleware = (changeSecret) => {
      let oldToken;
      if (changeSecret) {
        oldToken = access_token;
        access_token = "blabalblalba";
      }

      return new Promise((resolve, reject) => {
        connect.use(middleware.isAuthenticated)
          .req(req => {
            req.query = { access_token };
          })
          .next((res) => {
            access_token = oldToken;
            if (res && res.status == 401) {
              reject(res.message);
            } else {
              resolve();
            }
          })
          .dispatch();
      });
    };

    it('should validate correctly', () => {
      return mockedMiddleware().should.be.fulfilled;
    });

    it('should not validate', () => {
      return mockedMiddleware(true).should.be.rejected;
    });

  });

  describe('setTokenCookie', () => {

    it('sets cookie in the res object', () => {
       let req  = httpMocks.createRequest({
          user: { _id: 111, role: 'admin' }
      });
      let res = httpMocks.createResponse();

      middleware.setTokenCookie(req, res);
      expect(res.cookies.token).to.exist;
    });

  });

});
