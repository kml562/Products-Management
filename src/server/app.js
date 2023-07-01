import express, { urlencoded } from 'express';
import multer from 'multer';
const app = express();


// global middleware --------------------------------------------------------------------------------
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(multer().any());




export default app;
