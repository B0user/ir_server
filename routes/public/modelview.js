const express = require('express');
const router = express.Router();
const modelsController = require('../../controllers/api/modelsController');

router.get('/:pid', modelsController.readVariations);

module.exports = router;