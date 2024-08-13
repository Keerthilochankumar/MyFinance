const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
   console.log("from authMiddleware token", token);

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    console.log("from authMiddleware req.user");
    if (!req.user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
