// const path = require('path');
// const appRoot = require('app-root-path').path;
// const authPath = `${appRoot}/server/modules/auth`;
// const proxyquire = require('proxyquire');

// // Stub the API endpoints by empty sinnon stubs
// const routerStub = {
//   post: sinon.stub()
// };

// const authStub = {
//   express: { // Mock express.Router
//     Router: function() {
//       return routerStub;
//     }
//   },
//   User: sinon.stub(),
//   './strategies/local/passport': {
//     setup: sinon.stub()
//   }
// };

// // Mock the auth/index.js file
// const auth = proxyquire(`${authPath}/index`, authStub);

// describe('Auth module: ', () => {

//   it('should return an express router instance', () => {
//     expect(auth).to.equal(routerStub);
//   });

//   it('should call local.setup passport strategy', () => {
//     expect(authStub['./strategies/local/passport'].setup).to.have.been.calledOnce;
//   });

//   it('should verify admin role and route to user.controller.index', () => {
//     expect(routerStub.post
//       .withArgs('/')
//       ).to.have.been.calledOnce;
//   });

// });
