import { Request, Response, NextFunction } from 'express';

export type UserRole = 'END_USER' | 'L1_AGENT' | 'L2_AGENT' | 'HELPDESK_MANAGER' | 'SYS_ADMIN';

export function rbacMiddleware(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Insufficient permissions. Required role: [${allowedRoles.join(', ')}]. Provided role: ${req.user.role}`,
      });
    }

    next();
  };
}
