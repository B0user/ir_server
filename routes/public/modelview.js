const express = require('express');
const router = express.Router();
const modelsController = require('../../controllers/api/modelsController');
const productsController = require('../../controllers/api/productsController');

router.get('/products/:cid', productsController.getProductsForClient);
router.get('/:pid', modelsController.readVariations);

module.exports = router;