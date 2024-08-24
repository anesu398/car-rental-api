const Car = require('../models/Car');
const asyncHandler = require('express-async-handler');

// @desc    Create a new car listing
// @route   POST /api/cars
// @access  Private (only logged-in users)
const createCar = asyncHandler(async (req, res) => {
  const { make, model, year, pricePerDay } = req.body;

  const car = new Car({
    make,
    model,
    year,
    pricePerDay,
    owner: req.user._id,
  });

  const createdCar = await car.save();
  res.status(201).json(createdCar);
});

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
const getCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({ availability: true });
  res.json(cars);
});

// @desc    Get car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).populate('owner', 'name email');

  if (car) {
    res.json(car);
  } else {
    res.status(404);
    throw new Error('Car not found');
  }
});

module.exports = {
  createCar,
  getCars,
  getCarById,
};
