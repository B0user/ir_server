const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/api/reportsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.get('/', verifyRoles(ROLES_LIST.Support), reportsController.getReports);

module.exports = router;