import bcrypt from 'bcrypt';

class HashingService {
    async hashPassword(password:string):Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async comparePassword(password:string, hashedPassword:string): Promise<boolean>  {
        return await bcrypt.compare(password, hashedPassword);
    }
}

export default HashingService;
