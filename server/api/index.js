import express from 'express';

const router = express.Router();

/** Route: /api/ */
router.get('/', (req, res, next) => {
  // can use async/await to load data before
  res.render('path/to/view', { title: 'Express' });
});

export default router;