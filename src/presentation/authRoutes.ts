import express from 'express';
import AuthController from '../controller/authController'; 
import AuthUseCase from '../useCases/authUsecase'; 
import AuthRepository from '../infrastructure/repositories/authRepository'; 
import HashingService from '../utils/hashingService'; 
import JwtService from '../utils/jwtService'; 
import userModel from '../infrastructure/database/userModel'; 

const authRouter = express.Router();

const hashingService = new HashingService();
const jwtService = new JwtService();
const authRepository = new AuthRepository(userModel);
const authUseCase = new AuthUseCase(authRepository, hashingService, jwtService);
const authController = new AuthController(authUseCase);



authRouter.post('/register', (req, res) => authController.register(req, res));
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.put('/resetpassword/:userId',(req,res)=> authController.resetPassword(req,res))

export default authRouter;
