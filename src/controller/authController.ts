import { Request, Response } from 'express';
import AuthUseCase from '../useCases/authUsecase';
import { userType } from '../infrastructure/interfaces/userType';

class AuthController {
    private authUseCase: AuthUseCase;

    constructor(authUseCase: AuthUseCase) {
        this.authUseCase = authUseCase;
    }

    async register(req: Request, res: Response) {
        try {
            const user: userType = await this.authUseCase.register(req.body);
           return res.status(201).json({ status: 'success', message: 'User registered successfully', data: user });
        } catch (error:any) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result  = await this.authUseCase.login(email, password);

            if ('status' in result) {
                return res.status(404).json({ status: 'error', message: 'In valid Email or Password'});
            }
            const { userData , accessToken, refreshToken } = result;

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000 
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 604800000 
            });
             
            return  res.status(200).json({ status: 'success', message: 'Login successful', data: { user:userData } });

        } catch (error:any) {
            return res.status(401).json({ status: 'error', message: error.message });
        }
    }

    async resetPassword(req:Request,res:Response){
     try{
        const {userId}=req.params
        const {oldPassword,newPassword}=req.body
        const changePassword = await this.authUseCase.resetPassword(userId,oldPassword,newPassword)
        if(changePassword){
        return res.status(200).json({ status: 'success', message: 'Password changed successful'});
        }
        return res.status(400).json({ status: 'error', message: "something went wrong please try again later"})
     }catch(error:any){
       return res.status(400).json({ status: 'error', message: error.message })
     }
    }

    

}

export default AuthController;
