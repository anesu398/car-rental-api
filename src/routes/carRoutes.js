const express = require('express');
const { createCar, getCars, getCarById } = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createCar)
  .get(getCars);

router.route('/:id')
  .get(getCarById);

module.exports = router;
