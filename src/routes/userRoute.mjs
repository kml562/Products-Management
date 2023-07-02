import express from "express";
const router = express.Router();

router.get('/check', function (req, res) {
    try {
        res.send("succesfully registered")
    } catch (error) {
 res.send(error.message);
    }
 
})

router.post('/register', )



export default router;