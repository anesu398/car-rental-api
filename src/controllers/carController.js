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

// @desc    Add a review to a car
// @route   POST /api/cars/:id/review
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error('Rating and comment are required');
  }

  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  const review = {
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  car.reviews.push(review);

  await car.save();

  res.status(201).json(review);
});

// @desc    Book a car
// @route   POST /api/cars/:id/book
// @access  Private
const bookCar = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error('Start date and end date are required');
  }

  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  if (!car.available) {
    res.status(400);
    throw new Error('Car is not available for booking');
  }

  // Check for overlapping bookings
  for (const booking of car.bookings) {
    if (
      (new Date(startDate) >= booking.startDate && new Date(startDate) <= booking.endDate) ||
      (new Date(endDate) >= booking.startDate && new Date(endDate) <= booking.endDate) ||
      (new Date(startDate) <= booking.startDate && new Date(endDate) >= booking.endDate)
    ) {
      res.status(400);
      throw new Error('Booking overlaps with an existing booking');
    }
  }

  car.bookings.push({ startDate, endDate, user: req.user._id });
  car.available = false;

  await car.save();

  res.status(200).json({ message: 'Car booked successfully' });
});

// @desc    Delete a car listing
// @route   DELETE /api/cars/:id
// @access  Private (only the owner or admin can delete)
const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  // Check if the user is the owner of the car or an admin
  if (car.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this car');
  }

  await car.remove();

  res.status(200).json({ message: 'Car removed successfully' });
});

module.exports = {
  createCar,
  getCars,
  getCarById,
  addReview,
  bookCar,
  deleteCar,
};
