const jwt = require('jsonwebtoken');
const env = require('../config/env');

function authenticate(role) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      if (role && payload.role !== role) return res.status(403).json({ message: 'Forbidden' });
      req.user = payload;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

module.exports = { authenticate };

