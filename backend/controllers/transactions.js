const { Transaction } = require('../models');

// Add a new transaction
exports.addTransaction = async (req, res) => {
  const { amount, type, currency, category, desc, date } = req.body;
  const userId = req.user.id;
  try {
    const transaction = await Transaction.create({ amount, type, currency, category, desc, date, userId });
    res.status(201).json({ transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  const userId = req.user.id;
  try {
    const transactions = await Transaction.findAll({ where: { userId } });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a transaction
exports.editTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, type, currency, category, desc, date } = req.body;
  const userId = req.user.id;
  try {
    const transaction = await Transaction.findOne({ where: { id, userId } });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    await transaction.update({ amount, type, currency, category, desc, date });
    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const transaction = await Transaction.findOne({ where: { id, userId } });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    await transaction.destroy();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
