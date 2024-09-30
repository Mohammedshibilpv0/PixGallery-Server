import { Request, Response } from "express";
import UserUseCase from "../useCases/userUseCase";

class UserController {
  private userUseCase: UserUseCase;

  constructor(userUseCase: UserUseCase) {
    this.userUseCase = userUseCase;
  }

  async addImage(req: Request, res: Response) {
    const { userId } = req.params;
    const {titles}=req.body
    console.log(req.body)
    try {
      const imageUrl = await this.userUseCase.uploadUserImages(userId, req, titles);
      res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error:any) {
      console.log(error)
      res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
  }

  async getGallery(req:Request,res:Response){
    try{
      const {userId}=req.params
      
      const userGallery = await this.userUseCase.getGallery(userId)
      if(userGallery?.length==0){
        return res.status(204).json({message:"There is no images on user gallery",gallery:[]})
      }
      return res.status(200).json({message:"Success",gallery:userGallery})
    }catch(error:any){
      res.status(500).json({ message: 'Failed to fetch image', error: error.message });
    }
  }

  async changePostion(req:Request,res:Response){
    try{
      const {updatedImages} = req.body
      const orderImage = await this.userUseCase.orderImage(updatedImages)
      if(orderImage){
       return res.status(200).json({message:'success'})
      }
      return res.status(400).json({message:'error'})

    }catch(error:any){
      res.status(500).json({ message: 'Failed to change image postion', error: error.message });
    }
  }

  async editImage(req:Request,res:Response){
    try{
      const {id,image,title}=req.body

      const editImage = await this.userUseCase.editImage(id,image,title)
      if(editImage){
       return res.status(200).json({ message: 'Image edited successfully', image:editImage });
      }
      return res.status(400).json({message:'Failed to edit image'})
    }catch(error:any){
      res.status(500).json({ message: 'Failed to edit image', error: error.message });
    }
  }

  async deleteImage(req:Request,res:Response){
    try{

      const {imageId}=req.params
      const deleteImage = await this.userUseCase.deleteImage(imageId)
      if(deleteImage){
        return res.status(200).json({message:'success'})
      }
      return res.status(400).json({message:"something went wrong please try again later"})
    }catch(error:any){
      res.status(500).json({ message: 'Failed to delete image', error: error.message });
    }
  }
}

export default UserController;
