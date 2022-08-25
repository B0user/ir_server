const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/api/uploadController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.Boss), uploadController.uploadFiles);

module.exports = router;