const express = require('express');
const router = express.Router();
const filesController = require('../../controllers/api/filesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.post('/upload/models', verifyRoles(ROLES_LIST.Boss), filesController.uploadModel);
router.post('/upload/thumb', verifyRoles(ROLES_LIST.Client), filesController.uploadThumb);
router.post('/upload/images', verifyRoles(ROLES_LIST.Client), filesController.uploadImages);

// router.delete('/delete/fname', ...) Delete file from disk


module.exports = router;