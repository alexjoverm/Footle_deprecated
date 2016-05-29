const express =  require('express');
const appRoot =  require('app-root-path');

const router = express.Router();

// Add API routes here
// Prefix: /api/articles
router.get('/', (req, res) => res.render(`${appRoot.path}/server/views/public/index`));

module.exports = router;
