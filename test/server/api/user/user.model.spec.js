// const appRoot = require('app-root-path').path;
// const User    = require(`${appRoot}/server/api/users/users.model`);

// let user;
// const genUser = () => {
//   user = new User({
//     provider: 'local',
//     name: 'Fake User',
//     email: 'test@example.com',
//     password: 'password'
//   });
//   return user;
// };

// describe('User Model', () => {
//   before(() => User.remove());

//   beforeEach(() => {
//     genUser();
//   });

//   afterEach(() => User.remove());

//   it('should begin with no users', () =>
//     expect(User.find({}).exec()).to
//       .eventually.have.length(0)
//   );

//   it('should fail when saving a duplicate user', () =>
//     expect(user.save().then(() => {
//       const userDup = genUser();
//       userDup.save();
//     })).to.be.rejected
//   );

//   describe('#email', () => {
//     it('should fail when saving with a blank email', () => {
//       user.email = '';
//       expect(user.save()).to.be.rejected;
//     });

//     it('should fail when saving with a null email', () => {
//       user.email = null;
//       expect(user.save()).to.be.rejected;
//     });

//     it('should fail when saving without an email', () => {
//       user.email = undefined;
//       expect(user.save()).to.be.rejected;
//     });

//     describe('given user provider is google', () => {
//       beforeEach(() => {
//         user.provider = 'google';
//       });

//       it('should succeed when saving without an email', () => {
//         user.email = null;
//         expect(user.save()).to.be.fulfilled;
//       });
//     });

//     describe('given user provider is facebook', () => {
//       beforeEach(() => {
//         user.provider = 'facebook';
//       });

//       it('should succeed when saving without an email', () => {
//         user.email = null;
//         expect(user.save()).to.be.fulfilled;
//       });
//     });

//     describe('given user provider is twitter', () => {
//       beforeEach(() => {
//         user.provider = 'twitter';
//       });

//       it('should succeed when saving without an email', () => {
//         user.email = null;
//         expect(user.save()).to.be.fulfilled;
//       });
//     });

//     describe('given user provider is github', () => {
//       beforeEach(() => {
//         user.provider = 'github';
//       });

//       it('should succeed when saving without an email', () => {
//         user.email = null;
//         expect(user.save()).to.be.fulfilled;
//       });
//     });
//   });

//   describe('#password', () => {
//     it('should fail when saving with a blank password', () => {
//       user.password = '';
//       expect(user.save()).to.be.rejected;
//     });

//     it('should fail when saving with a null password', () => {
//       user.password = null;
//       expect(user.save()).to.be.rejected;
//     });

//     it('should fail when saving without a password', () => {
//       user.password = undefined;
//       expect(user.save()).to.be.rejected;
//     });

//     describe('given the user has been previously saved', () => {
//       beforeEach(() => user.save());

//       it('should authenticate user if valid', () => {
//         expect(user.authenticate('password')).to.be.true;
//       });

//       it('should not authenticate user if invalid', () => {
//         expect(user.authenticate('blah')).to.not.be.true;
//       });

//       it('should remain the same hash unless the password is updated', () => {
//         user.name = 'Test User';
//         expect(user.save()
//           .then(u => u.authenticate('password'))).to.eventually.be.true;
//       });
//     });

//     describe('given user provider is google', () => {
//       beforeEach(() => {
//         user.provider = 'google';
//       });

//       it('should succeed when saving without a password', () => {
//         user.password = null;
//         expect(user.save()).to.be.fulfilled;
//       });
//     });

//     describe('given user provider is facebook', () => {
//       beforeEach(() => {
//         user.provider = 'facebook';
//       });

//       it('should succeed when saving without a password', () => {
//         user.password = null;
//         expect(user.save()).to.be.fulfilled;
//       });
//     });

//     describe('given user provider is twitter', () => {
//       beforeEach(() => {
//         user.provider = 'twitter';
//       });

//       it('should succeed when saving without a password', () => {
//         user.password = null;
//         expect(user.save()).to.be.fulfilled;
//       });
//     });

//     describe('given user provider is github', () => {
//       beforeEach(() => {
//         user.provider = 'github';
//       });

//       it('should succeed when saving without a password', () => {
//         user.password = null;
//         expect(user.save()).to.be.fulfilled;
//       });
//     });
//   });
// });
