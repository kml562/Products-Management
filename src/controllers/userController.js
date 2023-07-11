import validator from "validator";
import {
  isValid,
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidStr,
} from "../utils/validatior/validatior.js";
import userModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";
import { uploadFile } from "../aws/aws.js";
import jwt from "jsonwebtoken";

//---------------------------------------------------------------------------------------------------------
export const createUser = async (req, res) => {
  try {
    console.log(req.body);
    let jsondata = JSON.parse(req.body.data);
    console.log(jsondata);
    const { fname, lname, email, phone, password, address } = jsondata;
    if (!fname || !lname || !email || !phone || !password || !address) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid parameters" });
    }
    // name validator-----------------------------------------------------------------------------
    if (!isValidName(fname || !isValidName(lname))) {
      return res.status(400).json({ status: false, message: "Invalid name" });
    }
    // email validator------------------------------------------------------------------------------------
    if (!validator.isEmail(email) || !isValidEmail(email)) {
      return res.status(400).json({ status: false, message: "Invalid email" });
    }
    //password validator--------------------------------------------------------------------------------
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid password" });
    }

    //without regex validation---------------------------------------------------------------------------
    if (password.trim().length < 8 || password.trim().length > 15) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid password ." });
    }
    //phone number validator--------------------------------------------------------------------------------

    if (!validator.isMobilePhone(phone, "any")) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid mobile number" });
    }
    // address validation-------------------------------------------------------------------------

    const checkdata = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (checkdata) {
      return res
        .status(400)
        .json({ status: false, message: "user already exists" });
    }
    let Data = jsondata;
    const files = req.files;

    if (files && files.length > 0) {
      let uploadedFileURL = await uploadFile(files[0]);

      jsondata.profileImage = uploadedFileURL;
      Data.profileImage = uploadedFileURL;
    } else {
      return res.status(400).json({ msg: "No file found" });
    }
    //hashing  the password---------------------------------------------------------------------------------
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    Data.password = hashedPassword; // returning the hashed password ---------------------------------

    const data = await userModel.create(Data);
    return res.status(201).json({ status: true, data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// ---------------------------------------------------------------------------------------------------------

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // email validator------------------------------------------------------------------------------------
    if (!validator.isEmail(email) || !isValidEmail(email)) {
      return res.status(400).json({ status: false, message: "Invalid email" });
    }
    //password validator--------------------------------------------------------------------------------
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid password" });
    }

    //without regex validation---------------------------------------------------------------------------
    if (password.trim().length < 8 || password.trim().length > 15) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid password ." });
    }

    const userlogin = await userModel.findOne({ email: email });

    //----------------------------------------------------------------------------------------------------
    bcrypt.compare(password, userlogin.password, function (err, passwordMatch) {
      if (err || !passwordMatch) {
        return res
          .status(400)
          .json({ status: false, message: "Passwords do not match" });
      }

      const { JWT_SECRET, JWT_EXPIRY } = process.env;
      const token = jwt.sign({ id: userlogin._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
      });

      res.setHeader("x-api-key", token);
      return res.status(200).json({
        status: true,
        message: "User login successfull",
        data: {
          userId: userlogin._id,
          token: token,
        },
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

//------------------------------------------------------------------------------------------------------

export const getProfileDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ status: false, error: "Invalid user Id" });
    }

    if (req.decodedToken.id !== userId) {
      return res
        .status(400)
        .json({ status: false, error: "you are not allowed to access this" });
    }
    const data = await userModel.findById(userId);
    if (!data) {
      return res.status(404).json({ status: false, error: "not a valid user" });
    }

    return res
      .status(200)
      .json({ status: true, message: "User profile details", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

//===========================================================================================

export const updateUser = async (req, res) => {
  try {
      const data = req.body;
      const userId = req.params.userId;
      const { fname, lname, email, phone, password, address } = data;
      //check userId is valid or not 
      if (!isValid(userId)) {
          return res.status(400).json({ status: false, message: "invalid userId" });
      }
      //check is there any data exist for given userId

      const findData = await userModel.findById(userId);
      if (!findData) {
          return res.status(404).json({ status: false, message: "no data found" });
      }
      const newObj = {};
      //if user entering any field validate that field

      if (fname) {
          if (!isValidStr(fname)) {
              return res.status(400).json({ status: false, message: "invalid fname" });
          }
          newObj.fname = fname;
      }

      if (lname) {
          if (!isValidStr(lname)) {
              return res.status(400).json({ status: false, message: "invalid lname" });
          }
          newObj.lname = lname;
      }

      if (email) {
          if (!isValidStr(email)) {
              return res.status(400).json({ status: false, message: "invalid email" });
          } if (!isValidEmail(email)) {
              return res.status(400).json({ status: false, message: "email is not valid" });
          }

          newObj.email = email;
      }

      if (phone) {
          if (!isValid(phone)) {
              return res.status(400).json({ status: false, message: "invalid phone" });
          }
          if (!validator.isMobilePhone(phone, "any")) {
              return res.status(400).json({ status: false, message: "phone is not valid" });
          }
          newObj.phone = phone;
      }

      if (password) {
          if (!isValidStr(password)) {
              return res.status(400).json({ status: false, message: "invalid password" });
          }
          if (!isValidPassword(password)) {
              return res.status(400).json({ status: false, message: "password is not valid" });
          }
          newObj.password = password;
      }

      if (address) {
          if (typeof (address) !== 'object') {
              return res.status(400).json({ status: false, message: "invalid address" });
          }
          let { shipping, billing } = address;
          if (shipping) {
              if (typeof (shipping) !== 'object') {
                  return res.status(400).json({ status: false, message: "invalid shipping type" });
              }
              let { street, city, pincode } = shipping;
              if (street) {
                  if (!isValidStr(street)) {
                      return res.status(400).json({ status: false, message: "invalid shipping street" });
                  }

              }

              if (city) {
                  if (!isValidStr(city)) {
                      return res.status(400).json({ status: false, message: "invalid shipping city" });
                  }

              }

              // if (pincode) {
              //     if (!validator.is(pincode)) {
              //         return res.status(400).json({ status: false, message: "invalid shipping pincode" });
              //     }

              // }
          }

          if (billing) {
              if (typeof (billing) !== 'object') {
                  return res.status(400).json({ status: false, message: "invalid billing type" });
              }
              let { street, city, pincode } = billing;
              if (street) {
                  if (!isValidStr(street)) {
                      return res.status(400).json({ status: false, message: "invalid billing street" });
                  }

              }

              if (city) {
                  if (!isValidStr(city)) {
                      return res.status(400).json({ status: false, message: "invalid billing city" });
                  }

              }

              if (pincode) {
                  if (!isValidPincode(pincode)) {
                      return res.status(400).json({ status: false, message: "invalid billing pincode" });
                  }

              }
          }
          newObj.address = address
      }
      let files = req.files;
      if (files && files.length > 0) {
          if (!isValidStr(files)) {
              return res.status(400).json({ status: false, message: " file not found" });
          }
          let uploadFileURL = await uploadFile(files[0]);

          newObj.profileImage = uploadFileURL;
      }

      //update data

      const updateData = await userModel.findByIdAndUpdate(userId, newObj, { new: true });
      return res.status(200).json({ status: true, message: "success", data: updateData });


  } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
  }
}

//===========================================================================================
