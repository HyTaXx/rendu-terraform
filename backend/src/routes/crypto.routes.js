const router = require('express').Router();
const ctrl = require('../controllers/crypto.controller');

router.get('/cryptos', ctrl.getTopCryptos);
router.get('/history/:id', ctrl.getHistory7d);

module.exports = router;
