const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

const { verifyToken, isAdmin, isManager } = require('../middleware/authMiddleware');

router.get('/', verifyToken, bookController.getAllBooks);
router.post('/', verifyToken, isManager, bookController.addBook);
router.put('/issue/:id', verifyToken, isManager, bookController.issueBook);
router.put('/return/:id', verifyToken, isManager, bookController.returnBook);
router.delete('/:id', verifyToken, isManager, bookController.deleteBook);

module.exports = router;
