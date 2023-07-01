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
        require:true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        validate: {
            function (email) {
                const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailregex.test(email);
            },
            message:'invalid email type',
        } 
    },
    profileImage: {
        
    }
})



// { 
//     fname: {string, mandatory},
//     lname: {string, mandatory},
//     email: {string, mandatory, valid email, unique},
//     profileImage: {string, mandatory}, // s3 link
//     phone: {string, mandatory, unique, valid Indian mobile number}, 
//     password: {string, mandatory, minLen 8, maxLen 15}, // encrypted password
//     address: {
//       shipping: {
//         street: {string, mandatory},
//         city: {string, mandatory},
//         pincode: {number, mandatory}
//       },
//       billing: {
//         street: {string, mandatory},
//         city: {string, mandatory},
//         pincode: {number, mandatory}
//       }
//     },
//     createdAt: {timestamp},
//     updatedAt: {timestamp}
//   }