// Loads the sample menu in data/foodItems.json into MongoDB.
// Usage: npm run seed   (replaces existing food items and categories)
const mongoose = require('mongoose');
const { mongoURI } = require('./config');
const FoodItem = require('./models/food_items');
const FoodCategory = require('./models/food_category');
const items = require('./data/foodItems.json');

(async () => {
  await mongoose.connect(mongoURI);
  const categories = [...new Set(items.map((i) => i.CategoryName))].map((CategoryName) => ({ CategoryName }));
  await FoodItem.deleteMany({});
  await FoodCategory.deleteMany({});
  await FoodCategory.insertMany(categories);
  await FoodItem.insertMany(items);
  console.log(`Seeded ${categories.length} categories and ${items.length} food items`);
  await mongoose.disconnect();
})().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
