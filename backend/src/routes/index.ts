import { Router } from 'express';

const router:Router = Router();

// API routes
router.get('/api', (req, res) => {
  res.json({
    message: 'Website Builder API',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

export default router;
