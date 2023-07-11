import express, { urlencoded } from 'express';
import multer from 'multer';
import userRouter from '../routes/userRoute.mjs'
import cartRouter from '../routes/cartRouter.js'
const app = express();


// global middleware --------------------------------------------------------------------------------
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(multer().any());

// local routes --------------------------------------------------------------------------------------
app.use('/', userRouter);
app.use('/', cartRouter);

export default app;
