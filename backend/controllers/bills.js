const { Bill } = require('../models');

// Add a new bill
exports.addBill = async (req, res) => {
  const { title, amount, currency, toWhom, dueDate } = req.body;
  const userId = req.user.id;
  try {
    const bill = await Bill.create({ title, amount, currency, toWhom, dueDate, userId });
    res.status(201).json({ bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bills
exports.getBills = async (req, res) => {
  const userId = req.user.id;
  try {
    const bills = await Bill.findAll({ where: { userId } });
    res.json({ bills });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a bill
exports.editBill = async (req, res) => {
  const { id } = req.params;
  const { title, amount, currency, toWhom, dueDate } = req.body;
  const userId = req.user.id;
  try {
    const bill = await Bill.findOne({ where: { id, userId } });
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    await bill.update({ title, amount, currency, toWhom, dueDate });
    res.json({ bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a bill
exports.deleteBill = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const bill = await Bill.findOne({ where: { id, userId } });
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    await bill.destroy();
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
