const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/api/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.Boss), usersController.addUserAdmin)
    .get(verifyRoles(ROLES_LIST.Boss), usersController.getAllUsers);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Boss), usersController.getUser)
    .delete(verifyRoles(ROLES_LIST.Boss), usersController.deleteUser)
    .put(verifyRoles(ROLES_LIST.Boss), usersController.updateUserAdmin);

router.route('/personal/:id')
    .put(verifyRoles(ROLES_LIST.Boss, ROLES_LIST.Client, ROLES_LIST.User), usersController.updateUser);

module.exports = router;