import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { env } from '../config/env.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, full_name, role, department, okta_id } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'UserExists',
          message: `User with email ${email} already exists`,
        });
      }

      const password_hash = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        email,
        password_hash,
        full_name,
        role: role || 'END_USER',
        department: department || 'General',
        okta_id: okta_id || undefined,
      });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          department: user.department,
          full_name: user.full_name,
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as any }
      );

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            department: user.department,
            okta_id: user.okta_id,
          },
          token,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'RegisterError', message: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'InvalidCredentials',
          message: 'Invalid email or password',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'InvalidCredentials',
          message: 'Invalid email or password',
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          department: user.department,
          full_name: user.full_name,
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as any }
      );

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            department: user.department,
            okta_id: user.okta_id,
          },
          token,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'LoginError', message: err.message });
    }
  }
}
