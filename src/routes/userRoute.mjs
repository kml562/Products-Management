import express from "express";
import { createUser, getProfileDetails, loginUser, updateUser } from "../controllers/userController.js";
const router = express.Router();
import AWS from 'aws-sdk'
import { auth, isLoggedIn } from "../middleware/authrzition.js";
AWS.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})


router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/user/:userId/profile', isLoggedIn, getProfileDetails);

router.put('/user/:userId/profile',isLoggedIn,auth, updateUser)



export default router