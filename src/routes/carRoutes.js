const express = require('express');
const router = express.Router();
const {
  createCar,
  getCars,
  getCarById,
  addReview,
  bookCar,
  deleteCar,
} = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getCars);
router.route('/:id').get(getCarById);

// Private routes (protected by middleware)
router.use(protect);
router.route('/').post(createCar);
router.route('/:id/review').post(addReview);
router.route('/:id/book').post(bookCar);
router.route('/:id').delete(deleteCar);

module.exports = router;
