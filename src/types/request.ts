// ===== types/request.ts =====
import { Request } from 'express';
import { UserType } from './user.js';

export interface AuthRequest extends Request {
	user?: UserType;
}
