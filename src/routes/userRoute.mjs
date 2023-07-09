import express from "express";
import { createUser, loginUser } from "../controllers/userController.js";
const router = express.Router();

router.get('/check', function (req, res) {
    try {
        res.send("succesfully registered")
    } catch (error) {
 res.send(error.message);
    }
 
})

router.post('/register', createUser )

router.post('/login', loginUser )


export default router;