
const express  = require('express');
const articles = require('./articles');
const users    = require('./users');

const router = express.Router();

// Add API routes here
// Prefix: /api
router.use('/articles', articles);
router.use('/users', users);

module.exports = router;
