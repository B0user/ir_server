const express = require('express');
const router = express.Router();
const contactformController = require('../../controllers/api/contactformController');

router.post('/', contactformController.createContactForm);

module.exports = router;