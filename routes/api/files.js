const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/api/uploadController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.post('/upload/models', verifyRoles(ROLES_LIST.Boss), uploadController.uploadModel);
router.post('/upload/images', verifyRoles(ROLES_LIST.Client), uploadController.uploadThumb);


module.exports = router;