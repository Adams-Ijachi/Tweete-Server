import mongoose from 'mongoose';
import bycrypt from 'bcryptjs';
import validator from 'validator';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate: {
          validator: validator.isEmail,
          message: 'Please provide valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    username: {
        type: String,
        // make it uppercase
        lowercase: true,
    },
  


},{timestamps: true});

UserSchema.pre('save', async function () {
    // console.log(this.modifiedPaths());
    // console.log(this.isModified('name'));
    if (!this.isModified('password')) return;
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
});

UserSchema.methods.generateAuthToken = async function () {
    
    const token = jwt.sign({ _id: this._id,username:this.username,email:this.email }, process.env.JWT_SECRET, {
        expiresIn: '24h',
        });
    return token;
};
UserSchema.methods.comparePassword = async function (password) {
    const isMatch = await bycrypt.compare(password, this.password);
    return isMatch;
};

UserSchema.methods.hasTweet = async function(tweetId){
    const tweet = await this.model('Tweet').findOne({_id:tweetId});
    if(!tweet){
       return false;
    }
    return tweet.user.toString() == this._id ? true : false;
}



export default  mongoose.model('User', UserSchema);