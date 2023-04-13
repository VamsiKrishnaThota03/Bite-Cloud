const mongoose = require('mongoose');
// const { collection } = require('./models/User');
const mongoURI = 'mongodb+srv://vamsikrishna:Tvkrishna%401@cluster0.mwhyaca.mongodb.net/?retryWrites=true&w=majority'
var database;

const mongoDB = async() =>{
    await mongoose.connect(mongoURI,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log(`Connected`);
    }).catch(err=>{
        console.log(err);
    })
}

module.exports = mongoDB;