const express = require('express');
const router = express.Router();
const cacheController = require('../controllers/cache.controller');

// GET /api/cache/stats - Get cache statistics
router.get('/stats', cacheController.getCacheStats);

// POST /api/cache/clear - Clear cache
router.post('/clear', cacheController.clearCache);

// POST /api/cache/warmup - Warm up cache
router.post('/warmup', cacheController.warmUpCache);

module.exports = router;
