import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './presentation/userRoutes';
import authRoutes from './presentation/authRoutes';
import { CLIENTURL, PORT } from './config/env';
import { connectDB } from './config/dbConfig';

const app: Application = express();

const corsOptions = {
    origin: CLIENTURL,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
 };

 app.use(cors(corsOptions));
 app.use(express.json());
 app.use(morgan('dev'));
 
 app.use('/auth', authRoutes);
 app.use('/user',userRoutes)


connectDB().then(()=>{
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  server.setTimeout(10 * 60 * 1000); 
})
