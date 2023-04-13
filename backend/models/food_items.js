const mongoose = require('mongoose');

const {Schema} = mongoose;

const DisplaySchema = new mongoose.Schema({
    CategoryName:{
        type:String
    },
    name:{
        type:String
    },
    img:{
        type:String
    },
    options:[
        {
            full:{
                type:String
            },
            half:{
                type:String
            },
            regular:{
                type:String
            },
            medium:{
                type:String
            },
            large:{
                type:String
            }
        }
    ],
    description:{
        type:String
    }
})

const monmodel = mongoose.model("food-items",DisplaySchema);
module.exports=monmodel