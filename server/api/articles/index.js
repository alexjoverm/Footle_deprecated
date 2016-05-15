import express     from 'express';
import appRoot from 'app-root-path';

const router = express.Router();

// Add API routes here
// Prefix: /api/articles
router.get('/', (req, res) => res.render(`${appRoot}/server/views/public/index`));

export default router;
