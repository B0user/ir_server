const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/api/reportsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.get('/', verifyRoles(ROLES_LIST.Support), reportsController.getReports);

router.get('/client', verifyRoles(ROLES_LIST.Client), reportsController.getReportsForClient)
router.post('/client', verifyRoles(ROLES_LIST.Client), reportsController.createClientReport);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Support, ROLES_LIST.Client), reportsController.getReportByID)
    .put(verifyRoles(ROLES_LIST.Support, ROLES_LIST.Client), reportsController.updateReport)
    .delete(verifyRoles(ROLES_LIST.Support, ROLES_LIST.Client), reportsController.deleteReport);

module.exports = router;