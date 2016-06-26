const appRoot = require('app-root-path').path;
const app = require(`${appRoot}/server`);
const request = require('supertest-as-promised');
const User = require(`${appRoot}/server/api/users/user.model`);
const { deletePropsMultiple } = require(`${appRoot}/test/utils`);

const removeVars = ['__v', '_id', 'password'];

const userData = {
  name: 'Fake User',
  email: 'test@example.com',
  password: 'password',
  role: 'user'
};

const adminData = {
  name: 'Fake Admin',
  email: 'admin@example.com',
  password: 'babalunga',
  role: 'admin'
};

describe('User API:', () => {

  let user;
  let admin;
  let tokenUser;
  let tokenAdmin;

  /**
   * Hooks for creating a User and Admin
   */
  before(done =>
    User.remove()
      .then(() => {
        user = new User(userData);
        const pUser = user.save();

        admin = new User(adminData);
        const pAdmin = admin.save();

        return Promise.all([pUser, pAdmin]);
      })
      .then(() => {
        // User auth
        request(app)
          .post('/auth')
          .send({
            email: userData.email,
            password: userData.password
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            tokenUser = res.body.token;

            // Admin auth
            request(app)
            .post('/auth')
            .send({
              email: adminData.email,
              password: adminData.password
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, resAdmin) => {
              tokenAdmin = resAdmin.body.token;
              done();
            });
          });
      })
  );

  // Clear users after testing
  after(() => User.remove());


  /**
   * User API tests
   */
  describe('GET /api/users', () => {

    it('should respond with a 401 when not authenticated', done => {
      request(app)
      .get('/api/users')
      .expect(401)
      .end(done);
    });

    it('should respond with a 403 called as user', done => {
      request(app)
      .get('/api/users')
      .query({ access_token: tokenUser })
      .expect(403)
      .end(done);
    });

    it('should respond with both the user and admin data', done => {
      request(app)
      .get('/api/users')
      .query({ access_token: tokenAdmin })
      .expect(200)
      .end((err, res) => {
        const expected = deletePropsMultiple([
          userData,
          adminData
        ], removeVars);
        const response = deletePropsMultiple(res.body, removeVars);
        expect(response).to.deep.equal(expected);
        done();
      });
    });
  });

  describe('GET /api/users/me', () => {

    it('should respond with a user profile when authenticated', done => {
      request(app)
        .get('/api/users/me')
        .set('authorization', `Bearer ${tokenUser}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body._id.toString()).to.equal(user._id.toString());
          done();
        });
    });

    it('should respond with a user profile, using access_token', done => {
      request(app)
        .get('/api/users/me')
        .query({ access_token: tokenUser })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body._id.toString()).to.equal(user._id.toString());
          done();
        });
    });

    it('should respond with a 401 when not authenticated', done => {
      request(app)
        .get('/api/users/me')
        .expect(401)
        .end(done);
    });
  });
});
