import express, { urlencoded } from 'express';
import multer from 'multer';
import userRouter from '../routes/userRoute.mjs'
const app = express();


// global middleware --------------------------------------------------------------------------------
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(multer().any());

// local routes --------------------------------------------------------------------------------------
app.use('/', userRouter);


export default app;
