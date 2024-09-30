import AuthRepository from '../infrastructure/repositories/authRepository'; 
import HashingService from '../utils/hashingService';
import JwtService from '../utils/jwtService';
import { userType } from '../infrastructure/interfaces/userType';
import { mapUser } from '../infrastructure/interfaces/Mappers/userMapper';

class AuthUseCase {
    private authRepository: AuthRepository;
    private hashingService: HashingService;
    private jwtService: JwtService;

    constructor(authRepository: AuthRepository, hashingService: HashingService, jwtService: JwtService) {
        this.authRepository = authRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
    }

    async register(userData:userType): Promise<userType> {
        const hashedPassword = await this.hashingService.hashPassword(userData.password || '');
        const alreadyUser = await this.authRepository.findByEmail(userData.email)
        if(!alreadyUser){
            return await this.authRepository.create({ ...userData, password: hashedPassword });
        }
        throw new Error('Email already exists');
    }

    async login(email: string, password: string): Promise<{ userData: userType; accessToken: string ,refreshToken:string}|{status:string}> {
        const user = await this.authRepository.findByEmail(email);
        if (user && await this.hashingService.comparePassword(password, user.password??'')) {
            const accessToken = this.jwtService.generateAccessToken(user);
            const refreshToken= this.jwtService.generateRefreshToken(user)
            const userData=mapUser(user)
            return { userData , accessToken,refreshToken };
        }
 
        return { status: 'Invalid email or password' }
    }
    
    async resetPassword(userId:string,oldPassword:string,newPassword:string):Promise<userType|null>{
        const checkUser = await this.authRepository.findById(userId)
        if(!checkUser){
            throw new Error('User not found')
        }
        console.log(oldPassword)
        const checkCurrentPassword =await this.hashingService.comparePassword(oldPassword,checkUser.password??'')
        console.log(checkCurrentPassword)
        if(!checkCurrentPassword){
            throw new Error('Current password is incorrect') 
        }
        const hashedPassword = await this.hashingService.hashPassword(newPassword)
        return await this.authRepository.changePassword(userId,hashedPassword)
    }
}

export default AuthUseCase;
