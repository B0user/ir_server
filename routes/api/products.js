const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/api/productsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Client), productsController.readAllProductsForClient)
    .post(verifyRoles(ROLES_LIST.Client), productsController.createProduct);

router.get('/all', verifyRoles(ROLES_LIST.Boss), productsController.readAllProducts);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Client), productsController.readProduct)
    .put(verifyRoles(ROLES_LIST.Client), productsController.updateProduct)
    .delete(verifyRoles(ROLES_LIST.Client), productsController.deleteProduct);

module.exports = router;