const { Saving } = require('../models');

// Add a new saving
exports.addSaving = async (req, res) => {
  const { amount, currency, desc, date } = req.body;
  const userId = req.user.id;
  try {
    const saving = await Saving.create({ amount, currency, desc, date, userId });
    res.status(201).json({ saving });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all savings
exports.getSavings = async (req, res) => {
  const userId = req.user.id;
  try {
    console.log(userId);
    const savings = await Saving.findAll( { where: { userId } });
    if (!savings) return res.status(404).json({ message: 'No savings found' });
    res.json({ savings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a saving
exports.editSaving = async (req, res) => {
  const { id } = req.params;
  const { amount, currency, desc, date } = req.body;
  const userId = req.user.id;
  try {
    const saving = await Saving.findOne({ where: { id, userId } });
    if (!saving) return res.status(404).json({ message: 'Saving not found' });
    await saving.update({ amount, currency, desc, date });
    res.json({ saving });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a saving
exports.deleteSaving = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const saving = await Saving.findOne({ where: { id, userId } });
    if (!saving) return res.status(404).json({ message: 'Saving not found' });
    await saving.destroy();
    res.json({ message: 'Saving deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
