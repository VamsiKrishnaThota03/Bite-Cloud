const express = require('express');
const router = express.Router();
const FoodItem = require('../models/food_items');
const FoodCategory = require('../models/food_category');

// Returns [foodItems, foodCategories]. GET is preferred; POST is kept for older clients.
const getFoodData = async (req, res) => {
  try {
    const [items, categories] = await Promise.all([FoodItem.find(), FoodCategory.find()]);
    res.json([items, categories]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load the menu' });
  }
};

router.get('/foodData', getFoodData);
router.post('/foodData', getFoodData);

module.exports = router;
