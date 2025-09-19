const router = require('express').Router();
router.use('', require('./crypto.routes'));
router.use('/cache', require('./cache.routes'));
module.exports = router;