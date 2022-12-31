const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/api/reportsController');
// const filesController = require('../../controllers/api/filesController');

router.post('/', reportsController.createPublicReport);

// Create check for photo safety!
// router.post('/screenshot', filesController.uploadThumb);

module.exports = router;