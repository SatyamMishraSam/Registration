const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/RegistrationFrom', {
    useNewUrlParser: true,
    useUnifiedTopology:true, 
    useCreateIndex: true,
    
}).then(()=> {
    console.log("db connection successfull!!!");
}).catch((err)=>{
    console.log(err);
})