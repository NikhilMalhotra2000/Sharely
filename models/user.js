const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.default.isEmail(value)) {
                throw new Error('Please enter a valid email address');
            }
        }
    },
    password: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.default.isStrongPassword(value)) {
                throw new Error('Please enter a strong password');
            }
        }
    },
    tokens: [{
        token:{
            type:String,
            required:true
        }
    }]
}, {timestamps: true});


const jwt = require('jsonwebtoken');
userSchema.methods.GenerateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id : user._id.toString()},"nick");

    user.tokens = user.tokens.concat({token : token});
    user.save();

    return token;
}

userSchema.methods.toJSON = function (){
    const user = this;
    const userObject = user.toObject(); // internat mongodb function to get data as is in object.

    delete userObject.tokens;
    delete userObject.password;

    return userObject;  // now no unncessary data is exposed to the user.
}

userSchema.pre("save", async function(next){
    const user = this;
    if(user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }   
    const userToken =
    next();
});


userSchema.statics.findByCredentials = async(email,password) =>{
    if (email != null && password != null) {
        const user = await User.findOne({ email: email });
        if (user != null) {
            const isPassCorrect = await bcrypt.compare(password, user.password);
            if (isPassCorrect) {
                return user;
            }
            else {
                throw new Error('Unable to Login!');
            }
        }
    }
    else{
        throw new Error('Unable to Login!');
    }
}

const User = new mongoose.model("users", userSchema);

module.exports = User;