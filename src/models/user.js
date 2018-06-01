/***********************
 * Module dependencies *
 ***********************/
let mongoose = require("mongoose");
bcrypt = require('bcrypt');


/********************************************
 *     MONGOOSE MODEL CONFIGURATION         *
 *******************************************/
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your firstname']
    },
    lastName: {
        type: String,
        required: [true, 'Please add your last name']
    },
    email: {type: String, unique: true, required: true},
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    meta: {
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date, default: Date.now},
    }     
});

userSchema.statics.isEmailUnique = function (email) {
    return new Promise((resolve, reject) => {
        this.findOne({email:email})
            .exec((err, user) => {
                if (user) reject();
                else resolve();
            });
    });

};


/******************
 * Export schema  *
 ******************/
module.exports = mongoose.model('User', userSchema);