import express     from 'express';
import appRootPath from 'app-root-path';

const router = express.Router(); // eslint-disable-line new-cap

// Add API routes here
// Prefix: /api/articles
router.get('/', (req, res) => res.render(`${appRootPath}/server/views/public/index`));

export default router;
