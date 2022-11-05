const express = require('express');
const router = express.Router();
const mvController = require('../../controllers/api/modelviewController');

router.get('/products/:cid', mvController.getProductsForClient);
router.get('/models/:pid', mvController.getModelsForProduct);

module.exports = router; 