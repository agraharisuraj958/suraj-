import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    await AuthService.registerPatient(email, password);
    res.status(201).json({ message: 'Patient registered successfully' });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.login(email, password);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ accessToken });
  }

  static async refresh(req: Request, res: Response) {
    const oldToken = req.cookies.refreshToken;
    if (!oldToken) return res.status(401).json({ error: 'No refresh token' });

    const { accessToken, refreshToken } = await AuthService.refresh(oldToken);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  }

  static async logout(req: Request, res: Response) {
    const oldToken = req.cookies.refreshToken;
    await AuthService.logout(oldToken);
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  }

  static async getMe(req: Request, res: Response) {
    res.json({ user: req.user });
  }
}