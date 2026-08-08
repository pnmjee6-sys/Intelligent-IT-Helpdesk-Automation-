import { prisma, checkDbConnection } from '../config/db.js';
import crypto from 'crypto';

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'END_USER' | 'L1_AGENT' | 'L2_AGENT' | 'HELPDESK_MANAGER' | 'SYS_ADMIN';
  department?: string | null;
  okta_id?: string | null;
  created_at: Date;
}

const fallbackUsers: UserRecord[] = [];

export class UserModel {
  static async findByEmail(email: string): Promise<UserRecord | null> {
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user as any;
    }
    return fallbackUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async findById(id: string): Promise<UserRecord | null> {
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user as any;
    }
    return fallbackUsers.find((u) => u.id === id) || null;
  }

  static async findByOktaId(oktaId: string): Promise<UserRecord | null> {
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const user = await prisma.user.findUnique({
        where: { okta_id: oktaId },
      });
      return user as any;
    }
    return fallbackUsers.find((u) => u.okta_id === oktaId) || null;
  }

  static async create(user: Omit<UserRecord, 'id' | 'created_at'>): Promise<UserRecord> {
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          password_hash: user.password_hash,
          full_name: user.full_name,
          role: user.role as any,
          department: user.department || 'General',
          okta_id: user.okta_id || undefined,
        },
      });
      return newUser as any;
    }

    const newUser: UserRecord = {
      ...user,
      id: crypto.randomUUID(),
      created_at: new Date(),
    };
    fallbackUsers.push(newUser);
    return newUser;
  }
}
