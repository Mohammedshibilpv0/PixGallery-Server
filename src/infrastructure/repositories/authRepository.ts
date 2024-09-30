import { userType } from "../interfaces/userType";
import mongoose from 'mongoose';

class AuthRepository {
    private userModel;
    constructor(userModel:any) {
        this.userModel = userModel;
    }

    async create(userData:userType):Promise<userType> {
        const user = new this.userModel(userData);
        await user.save();
        const userObject = user.toObject();
        delete userObject.password;
        return userObject
    }

    async findById(id:string):Promise<userType|null>{
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }
        return await this.userModel.findById(id)
    }

    async findByEmail(email:string):Promise<userType|null> {
        return await this.userModel.findOne({ email });
    }

    async changePassword (userId:string,password:string):Promise<userType|null>{
        return await this.userModel.findByIdAndUpdate(userId,{password})
    }

}

export default AuthRepository;
