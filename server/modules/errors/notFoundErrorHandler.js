const appRoot = require('app-root-path');

module.exports = class NotFoundErrorHandler {

  static handle(req, res) {
    // When in route is .all('/*') and in browser: http://localhost:3000/bjllhihb/pop?d=wws
    // the result it:
    //   console.log(req.path); --> /bjllhihb/pop
    //   console.log(req.route.path); --> /*
    //   console.log(req.originalUrl); --> /bjllhihb/pop?d=wws

    if (req.xhr) {
      res.status(404).json({ message: 'Resource not found!' });
    } else {
      res.status(404).render(`${appRoot.path}/server/views/public/404`);
    }
  }
}
