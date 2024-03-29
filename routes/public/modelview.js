const express = require('express');
const router = express.Router();
const mvController = require('../../controllers/api/modelviewController');

router.get('/products/:cid', mvController.getProductsForClient);
router.get('/exactproduct/:pid', mvController.getExactProduct);
router.get('/models/:pid', mvController.getModelInfoForProduct);

module.exports = router; 