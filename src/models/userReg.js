const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String
        // required: true
    },
    cpassword: {
        type: String
        // required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]


});

// generating the tokens==>
userSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, "mynameissatyammishrfromlucknow");
        // console.log(token);
        this.tokens = this.tokens.concat({ token: token }) //this means that save the above token in schema token
        await this.save();
        return token;

    } catch(err) {
        res.send(err);
        console.log(err);
    }
}



// encrypting the password==>

userSchema.pre("save", async function(next){ //it means before saving event  do pre hashing
    if (this.isModified('password')) { //this line is used if somone changes the password then
        console.log(`password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);  //passwd encrypted
        console.log(`Hashed Password is ${this.password}`); //new pswd
    }
    next(); //after hashing call the next function to execute which will go in app.js
})





// collection==>

const UserRegister = new mongoose.model('UserRegister', userSchema);

module.exports = UserRegister;








