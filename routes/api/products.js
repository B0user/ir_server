const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/api/productsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// Admin
router.get('/all', verifyRoles(ROLES_LIST.Boss), productsController.getAllProducts);

// Client
router.route('/')
    .post(verifyRoles(ROLES_LIST.Client), productsController.addProduct)
    .get(verifyRoles(ROLES_LIST.Client), productsController.getAllClientProducts);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Client), productsController.readProduct)
    .put(verifyRoles(ROLES_LIST.Client), productsController.updateProduct);

router.put('/:id/archivate', verifyRoles(ROLES_LIST.Client), productsController.archieveProduct);

module.exports = router;