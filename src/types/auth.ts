import { UserRole } from './user.js';

// Basic registration data
export interface RegisterRequest {
	first_name: string;
	last_name: string;
	username: string;
	password: string;
}

// Login data
export interface LoginRequest {
	username: string;
	password: string;
}

// Frontend form might have additional fields
export interface RegisterFormData extends RegisterRequest {
	confirm_password: string;
}

// For creating user in database (after validation)
export interface CreateUserData {
	first_name: string;
	last_name: string;
	username: string;
	password: string; // Should be hashed before this point
	role?: UserRole;
}
