const express = require('express');
const app = express();
const mongoose = require('mongoose')
const PORT = 5000;
const mongoDB = require('./db');
const cors = require('cors');
const food_category = require('./models/food_category');

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})

const corsOptions ={
    origin:'*',
    credentials:true,
    optionSuccessStatus:200,
}

app.use(cors(corsOptions));

// app.get('/foodData',async (req,res)=>{
//     const food = await food_items.find();
//     res.json(food);
// })

app.get('/foodCategory',async (req,res)=>{
    global.food_categorys = await food_category.find({});
    console.log(global.food_categorys);
})

mongoDB();




console.log([global.food_items])
app.get('/',(req,res)=>{
    res.send(`Hello World`);
})



app.use(express.json());
app.use('/api',require('./routes/CreateUser'));
app.use('/api',require('./routes/DisplayData'));

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})