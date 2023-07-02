import mongoose from "mongoose";
const objectId = mongoose.Schema.Types.ObjectId;
const { Schema, model } = mongoose;

const userSchema = new Schema({
    fname: {
        type: String,
        require: true
    },
    lname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        validate: {
            function(email) {
                const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailregex.test(email);
            },
            message: 'invalid email type',
        }
    },
    profileImage: {   //s3 link------------
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        shipping: {
            type: String, require: true
        },
        city: {
            type: String, require: true
        },
        pincode: { type: Number, require: true },
    },
    billing: {
        street: { type: String, require: true },
        city: { type: String, require: true },
        pincode: { type: Number, require: true },
    }
}, { timestamp: true });



const userModel = model("User", userSchema);
module.exports = userModel;