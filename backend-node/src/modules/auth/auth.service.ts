import { prisma } from '../../app';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { Role } from '@prisma/client';
import crypto from 'crypto';

export class AuthService {
  static async registerPatient(email: string, passwordRaw: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already in use', 400);

    const passwordHash = await bcrypt.hash(passwordRaw, 10);
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, passwordHash, role: Role.PATIENT }
      });
      await tx.patient.create({ data: { userId: user.id } });
      return user;
    });
  }

  static async login(email: string, passwordRaw: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid credentials', 401);

    const isMatch = await bcrypt.compare(passwordRaw, user.passwordHash);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    return this.generateTokens(user.id, user.role);
  }

  static async refresh(token: string) {
    // Basic hash to store in DB instead of raw token
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: tokenHash },
      include: { user: true }
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      if (tokenRecord) {
        // Reuse detection: Delete all tokens for this user if expired/compromised
        await prisma.refreshToken.deleteMany({ where: { userId: tokenRecord.userId } });
      }
      throw new AppError('Invalid or expired refresh token', 401);
    }

    // Delete the old token (Rotation)
    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });

    return this.generateTokens(tokenRecord.user.id, tokenRecord.user.role);
  }

  static async logout(token: string) {
    if (!token) return;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await prisma.refreshToken.deleteMany({ where: { token: tokenHash } });
  }

  private static async generateTokens(userId: string, role: Role) {
    const accessToken = jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await prisma.refreshToken.create({
      data: {
        token: tokenHash,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return { accessToken, refreshToken };
  }
}