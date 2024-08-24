const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Get the token from the header
      const token = authHeader.split(' ')[1];

      // Verify the token using the JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request object
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

module.exports = { protect };
