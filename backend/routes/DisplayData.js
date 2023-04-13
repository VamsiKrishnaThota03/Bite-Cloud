const express = require('express');
const router = express.Router();
const food_items = require('../models/food_items');
const foodcate = require('../models/food_category');


router.post('/foodData',async (req,res)=>{
    global.food = await food_items.find();
    global.foodCategory = await foodcate.find();
    res.json([global.food,global.foodCategory]);
    // res.json(global.foodCategory);
})


module.exports = router;