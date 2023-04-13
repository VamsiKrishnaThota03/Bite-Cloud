const mongoose = require('mongoose');
// const {Schema} = mongoose;
const foodCategory = new mongoose.Schema({
    CategoryName:{
        type:String
    }
})

const monmodel1 = mongoose.model('foodCategory',foodCategory);
module.exports = monmodel1;