import jwt from 'jsonwebtoken';
import { userType } from '../infrastructure/interfaces/userType';

class JwtService {
    generateAccessToken(user: userType): string {
        return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    }

    generateRefreshToken(user: userType): string {
        return jwt.sign({ id: user._id, email: user.email }, process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret', { expiresIn: '7d' });
    }

    verifyAccessToken(token: string) {
        return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    }

    verifyRefreshToken(token: string) {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret');
    }
}

export default JwtService;
