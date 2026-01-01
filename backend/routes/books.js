const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, bookController.getAllBooks);
router.post('/', verifyToken, bookController.addBook);
router.put('/issue/:id', verifyToken, bookController.issueBook);
router.put('/return/:id', verifyToken, bookController.returnBook);
router.delete('/:id', verifyToken, bookController.deleteBook);

module.exports = router;
