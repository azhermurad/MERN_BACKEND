const mongoose = require('mongoose');

mongoose.connect("'mongodb://localhost:27017/mernTest1").then(()=>{
    console.log("database is connected!")
}).catch(()=>{
    console.log("database is not connected")
})