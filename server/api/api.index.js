import express from 'express';
import articles from './articles';

const router = express.Router();

// Add API routes here
// Prefix: /api
router.use('/articles', articles);

export default router;
