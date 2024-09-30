import { Router } from 'express';
import multer from 'multer';
import FirebaseImageUploader from '../utils/firebaseImageUploader';
import UserRepository from '../infrastructure/repositories/userRepository';
import UserUseCase from '../useCases/userUseCase';
import UserController from '../controller/userController';
import GalleryModel from '../infrastructure/database/galleryModel';

const userRouter = Router();
const upload = multer({storage: multer.memoryStorage()});

const firebaseImageUploader = new FirebaseImageUploader();
const userRepository = new UserRepository(GalleryModel);
const userUseCase = new UserUseCase(userRepository, firebaseImageUploader);
const userController = new UserController(userUseCase);

userRouter.post('/addimage/:userId', upload.array('images', 7), (req, res) => {
  userController.addImage(req, res);
});

userRouter.get('/gallery/:userId',(req,res)=>userController.getGallery(req,res))
userRouter.put('/image-order',(req,res)=>userController.changePostion(req,res))
userRouter.put('/image',(req,res)=>userController.editImage(req,res))
userRouter.put(`/delete-image/:imageId`,(req,res)=>userController.deleteImage(req,res))

export default userRouter;
