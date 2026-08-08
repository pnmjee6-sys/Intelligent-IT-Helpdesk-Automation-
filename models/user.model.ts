import { dbPool, checkDbConnection } from '../config/db.js';
import crypto from 'crypto';

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'END_USER' | 'L1_AGENT' | 'L2_AGENT' | 'HELPDESK_MANAGER' | 'SYS_ADMIN';
  department?: string;
  okta_id?: string;
  created_at: Date;
}

// In-memory fallback store when PostgreSQL server is offline
const fallbackUsers: UserRecord[] = [];

export class UserModel {
  static async findByEmail(email: string): Promise<UserRecord | null> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      const res = await dbPool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
      return res.rows[0] || null;
    }
    return fallbackUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async findById(id: string): Promise<UserRecord | null> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      const res = await dbPool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
      return res.rows[0] || null;
    }
    return fallbackUsers.find((u) => u.id === id) || null;
  }

  static async findByOktaId(oktaId: string): Promise<UserRecord | null> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      const res = await dbPool.query('SELECT * FROM users WHERE okta_id = $1 LIMIT 1', [oktaId]);
      return res.rows[0] || null;
    }
    return fallbackUsers.find((u) => u.okta_id === oktaId) || null;
  }

  static async create(user: Omit<UserRecord, 'id' | 'created_at'>): Promise<UserRecord> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      const res = await dbPool.query(
        `INSERT INTO users (email, password_hash, full_name, role, department, okta_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [user.email, user.password_hash, user.full_name, user.role, user.department || 'General', user.okta_id || null]
      );
      return res.rows[0];
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
