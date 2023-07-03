import validator from "validator";
import { isValidPassword } from "../utils/validatior/validatior.js";
import userModel from "../models/UserModel.js";
import { uploadData } from "../aws/aws.js";
import bcrypt from "bcrypt";


export const createUser = async (req, res) => {
    try {
        const { fname, lname, email, phone, password, address, billing } = req.body;
        if (!fname || !lname || !email || !phone || !password || !address || !billing) {
            return res.status(400).json({ status: false, message: 'Invalid parameters' });
        };
  // email validator------------------------------------------------------------------------------------
        if (!validator.isEmail(email) || !isValidEmail(email)) {
            return res.status(400).json({ status: false, message: "Invalid email" });
        }
   //password validator--------------------------------------------------------------------------------
        if (!isValidPassword(password)) {
            return res.status(400).json({ status: false, message: "Invalid password" });
        }
   
    //without regex validation---------------------------------------------------------------------------
        if (password.trim().length < 8 || password.trim().length > 15) {
            return res.status(400).json({ status: false, message: "Invalid password ." });
        }
    //phone number validator--------------------------------------------------------------------------------
        req.body.phone = phone + "";
        phone = phone + "";
        if (!validator.isMobilePhone(phone, 'any')) {
            return res.status(400).json({ status: false, message: "Invalid mobile number" });
        }
       
        const checkdata = await userModel.findOne({ $or: [{ email: email }, { phone: phone }], });
        if (checkdata) {
            return res.status(400).json({ status: false, message: "user already exists" })
        }
        let Data = req.body;
        const files = req.files

        if (files && files.length > 0) {
            let uploadedFileURL = await uploadData(files[0])
  // res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
            req.body.cover = uploadedFileURL
            Data.cover = uploadedFileURL
        }
        else {
          return   res.status(400).send({ msg: "No file found" })
        }
  //hashing  the password---------------------------------------------------------------------------------
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        Data.password = hashedPassword;  // returning the hashed password ---------------------------------
       
        const data = await userModel.create(Data);
        return res.status(201).json({ status: true, data: data })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ---------------------------------------------------------------------------------------------

export const loginUser = (req, res) => {
    try {
        const { email, password } = req.body;
        // email validator------------------------------------------------------------------------------------
        if (!validator.isEmail(email) || !isValidEmail(email)) {
            return res.status(400).json({ status: false, message: "Invalid email" });
        }
        //password validator--------------------------------------------------------------------------------
        if (!isValidPassword(password)) {
            return res.status(400).json({ status: false, message: "Invalid password" });
        }
   
        //without regex validation---------------------------------------------------------------------------
        if (password.trim().length < 8 || password.trim().length > 15) {
            return res.status(400).json({ status: false, message: "Invalid password ." });
        };
        //-----------------------------------------------------------------------------------------------------
        bcrypt.compare(password, userlogin.password, function (err, passwordMatch) {
            if (err || !passwordMatch) {
                return res.status(400).json({ status: false, message: 'Passwords do not match' });
            }
  
            const token = jwt.sign({ id: userlogin._id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRY,
            });
  
            res.setHeader('x-api-key', token);
            return res.status(200).json({ status: true, data: { token: token } });
        });
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }
};




