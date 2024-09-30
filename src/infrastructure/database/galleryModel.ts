import mongoose, { Document, Query, Schema } from 'mongoose';


interface IGallery extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;                   
  url: string;                     
  createdAt: Date;    
  orderNo:Number     
  isDelete:boolean        
}


const gallerySchema = new Schema<IGallery>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDelete:{
    type:Boolean,
    default:false
  },
  orderNo:{
    type:Number
  }
});

gallerySchema.pre<Query<any, IGallery>>(/^find/, function (next) {
  this.where({ isDelete: { $ne: true } }); // Exclude isDelete: true
  next();
});

const GalleryModel = mongoose.model<IGallery>('Gallery', gallerySchema);

export default GalleryModel;