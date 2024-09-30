import { ImageType } from "../infrastructure/interfaces/galleryType";
import UserRepository from "../infrastructure/repositories/userRepository"; 
import FirebaseImageUploader from "../utils/firebaseImageUploader";
import { Request } from "express";

class UserUseCase {
  private userRepository: UserRepository;
  private imageUploader: FirebaseImageUploader;

  constructor(userRepository: UserRepository, imageUploader: FirebaseImageUploader) {
    this.userRepository = userRepository;
    this.imageUploader = imageUploader;
  }

  async uploadUserImages(userId: string, req: Request, titles: string[]): Promise<string[]> {
    const uploadedImages = await this.imageUploader.uploadImage(req);
    
    if (!uploadedImages || uploadedImages.length === 0) {
      throw new Error('Image upload failed.');
    }
  
    const userGallery = await this.userRepository.getUserGallery(userId);
    let count = userGallery.length;
  
    const uploadPromises = uploadedImages.map((image, index) => {
      const title = Array.isArray(titles) ? titles[index] : titles;
  
      return this.userRepository.saveUserImage(userId, image.url, title, count++);
    });
    await Promise.all(uploadPromises);  
    return await this.userRepository.getUserGallery(userId)
  
  }

  async getGallery(userId:string):Promise<ImageType[]|null>{
    
    const userGallery = await this.userRepository.getUserGallery(userId)
    if(userGallery==null){
      throw new Error('Cannot find the user gallery')
    }
    return userGallery
  }

  async orderImage(updatedImages:any):Promise<boolean>{

    const bulkWrite = updatedImages.map((image: any) => ({
      updateOne: {
        filter: { _id: image._id },
        update: { $set: { orderNo: image.order } } 
      }
    }));

   return this.userRepository.changeImagePosition(bulkWrite)
    
  }

  async editImage (id:string,image:string,title:string):Promise<ImageType|null>{
    return this.userRepository.editImage(id,title,image)
  }

  async deleteImage (imageId:string):Promise<boolean>{
    const deleteImage = await this.userRepository.deleteImage(imageId)
    if(deleteImage){
      return true
    }
    return false
  }
}

export default UserUseCase;
