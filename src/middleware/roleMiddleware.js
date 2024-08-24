const asyncHandler = require('express-async-handler');

const checkRole = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Access denied');
    }
    next();
  });
};

module.exports = checkRole;
