const express = require('express');
const router = express.Router();
const modelsController = require('../../controllers/api/modelsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.get('/all', verifyRoles(ROLES_LIST.Boss), modelsController.getAllModels);

router.route('/exact/:id')
    .get(verifyRoles(ROLES_LIST.Boss), modelsController.readModel)
    .put(verifyRoles(ROLES_LIST.Boss), modelsController.updateModel)
    .delete(verifyRoles(ROLES_LIST.Boss), modelsController.deleteModel);

router.route('/:pid')
    .post(verifyRoles(ROLES_LIST.Boss), modelsController.createModel)
    .get(verifyRoles(ROLES_LIST.Boss, ROLES_LIST.Client), modelsController.readVariations);


module.exports = router;