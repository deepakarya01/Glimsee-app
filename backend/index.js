import dotenv from 'dotenv'; dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {v2 as cloudinary} from 'cloudinary';

// Import routes
import authRoute from './routes/authRoute.js';
import postRoute from './routes/postRoute.js';
import userRoute from './routes/userRoute.js';
import notificationRoute from './routes/notificationRoute.js';

//Database connection
import { connectDB } from './lib/db.js';

//Cloudinary configuration
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_SECRET_KEY ,
})


const app = express();

app.use(express.json({limit: '10mb'})); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


//AUTH ROUTES
app.use('/api/auth', authRoute);

//USER ROUTES
app.use('/api/users', userRoute);

//POST ROUTES
app.use('/api/posts',postRoute);

//NOTIFICATION ROUTES
app.use('/api/notifications', notificationRoute);


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});