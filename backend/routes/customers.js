const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// All routes protected + Admin only
router.get('/', verifyToken, isAdmin, customerController.getAllCustomers);
router.post('/', verifyToken, isAdmin, customerController.addCustomer);
router.delete('/:id', verifyToken, isAdmin, customerController.deleteCustomer);

module.exports = router;
