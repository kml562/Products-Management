import validator from "validator";
import {
  isValid,
  isValidName,
  isValidPassword,
} from "../utils/validatior/validatior.js";
import userModel from "../models/UserModel.js";
import { uploadData } from "../aws/aws.js";
import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";

//---------------------------------------------------------------------------------------------------------
export const createUser = async (req, res) => {
  try {
    let jsondata = JSON.parse(req.body);
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
    req.body.phone = phone + "";
    phone = phone + "";
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
      let uploadedFileURL = await uploadData(files[0]);

      jsondata.profileImage = uploadedFileURL;
      Data.profileImage = uploadedFileURL;
    } else {
      return res.status(400).send({ msg: "No file found" });
    }
    //hashing  the password---------------------------------------------------------------------------------
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    Data.password = hashedPassword; // returning the hashed password ---------------------------------

    const data = await userModel.create(Data);
    return res.status(201).json({ status: true, data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------------------------------------------------------------------------------------------------------

export const loginUser = (req, res) => {
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
    //----------------------------------------------------------------------------------------------------
    bcrypt.compare(password, userlogin.password, function (err, passwordMatch) {
      if (err || !passwordMatch) {
        return res
          .status(400)
          .json({ status: false, message: "Passwords do not match" });
      }

      const token = jwt.sign({ id: userlogin._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
      });

      res.setHeader("x-api-key", token);
      return res.status(200).json({ status: true, data: { token: token } });
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

//------------------------------------------------------------------------------------------------------

export const getProfileDetails = (req, res) => {
  try {
    const { userId } = req.param;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ status: false, error: "Invalid user Id" });
    }

    const data = userModel.findById(userId);
    if (!data) {
      res.status(404).json({ status: false, error: "not a valid user" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

//===========================================================================================

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!isValid(userId)) {
      res.status(400).json({ status: false, message: "invalid user ID" });
    }
    //  const data = userModel.findById(userId);
    //     if (!userId) {
    //         res.status(404).josn({ status: false, message: "user not found" });
    //     };
    let thedata = JSON.parse(req.body);
    let file = req.files[0];
    if (!file) {
      let uploadedFileURL = await uploadData(file);
      thedata.profileImage = uploadedFileURL;
    }

    const updateData = await userModel.findByIdAndUpdate(userId, thedata, {
      new: true,
    });
    return res.status(200).json({ status: true,
    message: "User profile updated",
    data:thedata});
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


//===========================================================================================
