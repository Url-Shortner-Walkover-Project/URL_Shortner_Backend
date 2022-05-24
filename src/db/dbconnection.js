const mongoose = require('mongoose')

const password = encodeURIComponent("vishal8803");

mongoose.connect(`mongodb+srv://vishal8803:${password}@cluster0.cks95.mongodb.net/test`,
{ useNewUrlParser: true,
useUnifiedTopology: true,
}).then(()=>{
    console.log("connection is succesfull")
}).catch((e)=>{
    console.log(e)
    console.log("No connection")
})