import express  from 'express';
import articles from './articles';
import users    from './users';

const router = express.Router();

// Add API routes here
// Prefix: /api
router.use('/articles', articles);
router.use('/users', users);

export default router;
