const express = require('express');
const router = express.Router();
const modelsController = require('../../controllers/api/modelsController');
const productsController = require('../../controllers/api/productsController');

router.get('/products/:cid', productsController.getPublicClientProducts);
router.get('/models/:pid', modelsController.getVariations);

module.exports = router; 