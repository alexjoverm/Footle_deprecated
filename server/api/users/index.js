const Router         = require('express');
const controller     = require('./user.controller');
const appRoot        = require('app-root-path').path;
const userMiddleware = require(`${appRoot}/server/middleware/user`);

const router = new Router();

router.get('/', userMiddleware.hasRole('admin'), controller.index);
router.get('/me', userMiddleware.isAuthenticatedAttach(), controller.me);
router.get('/:id', userMiddleware.isAuthenticatedAttach(), controller.show);
router.post('/', controller.create);
router.put('/:id/password', userMiddleware.isAuthenticatedAttach(), controller.changePassword);
router.delete('/:id', userMiddleware.hasRole('admin'), controller.destroy);

module.exports = router;
