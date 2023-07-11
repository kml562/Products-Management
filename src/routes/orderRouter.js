import express from 'express'
import { auth, isLoggedIn } from '../middleware/authrzition.js'
import { createOrder, updateOrder } from '../controllers/orderController.js'
const router = express.Router()

router.post('/users/:userId/orders', isLoggedIn, auth, createOrder);
router.put('/users/:userId/orders', isLoggedIn, auth, updateOrder);

export default router