const express = require('express');
const { signup, signin, signout } = require('./controllers/auth');
const { addBill, getBills, editBill, deleteBill } = require('./controllers/bills');
const { addSaving, getSavings, editSaving, deleteSaving } = require('./controllers/savings');
const { addTransaction, getTransactions, editTransaction, deleteTransaction } = require('./controllers/transactions');
const { authMiddleware } = require('./middleware/auth');
const { getReport } = require('./controllers/Report');
const { handleFinancialOperation } = require('./controllers/chat');
const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', authMiddleware, signout);

// Bill routes
router.post('/bills', authMiddleware, addBill);
router.get('/bills', authMiddleware, getBills);
router.put('/bills/:id', authMiddleware, editBill);
router.delete('/bills/:id', authMiddleware, deleteBill);

// Savings routes
router.post('/savings', authMiddleware, addSaving);
router.get('/savings', authMiddleware, getSavings);
router.put('/savings/:id', authMiddleware, editSaving);
router.delete('/savings/:id', authMiddleware, deleteSaving);

// Transaction routes
router.post('/transactions', authMiddleware, addTransaction);
router.get('/transactions', authMiddleware, getTransactions);
router.put('/transactions/:id', authMiddleware, editTransaction);
router.delete('/transactions/:id', authMiddleware, deleteTransaction);
//Reports routes
router.get('/report', authMiddleware, getReport);

router.post('/chat', authMiddleware, handleFinancialOperation);
module.exports = router;
