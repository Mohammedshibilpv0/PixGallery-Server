import mongoose from 'mongoose';
import { ImageType } from '../interfaces/galleryType';

class UserRepository {
    private galleryModel: any;
  
    constructor(galleryModel: any) {
      this.galleryModel = galleryModel;
    }
  
    async saveUserImage(userId: string, url: string, title: string,count:number) {
       return await this.galleryModel.create({
        userId,
        url,
        title,
        orderNo:count+1
      });
    }
    async getUserGallery(userId:string){
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid ID format');
    }
        return await this.galleryModel.find({userId})
    }

  async changeImagePosition(bulkWrite:any) {
    try {
      return await this.galleryModel.bulkWrite(bulkWrite)
       
    } catch (error) {
        console.error('Error changing image position:', error);
        throw error; 
    }
}


  async editImage(id:string,title:string,url:string):Promise<ImageType|null>{
    return  await this.galleryModel.findByIdAndUpdate(id,{title,url})
  }

  async deleteImage(id:string){
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
  }
    return this.galleryModel.findByIdAndUpdate(id,{isDelete:true})
  }


  }
  
  export default UserRepository;
  