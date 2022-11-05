const express = require('express');
const router = express.Router();
const modelsController = require('../../controllers/api/modelsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// Admin
router.get('/all', verifyRoles(ROLES_LIST.Boss), modelsController.getAllModels);

router.route('/exact/:id')
    .get(verifyRoles(ROLES_LIST.Boss), modelsController.readModel)
    .put(verifyRoles(ROLES_LIST.Boss), modelsController.updateModel)
    
router.post('/exact/:id/archivate', verifyRoles(ROLES_LIST.Boss), modelsController.archieveModel);


router.route('/:pid')
    .post(verifyRoles(ROLES_LIST.Boss), modelsController.addModel);

module.exports = router;