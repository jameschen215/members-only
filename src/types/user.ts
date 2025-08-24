export enum UserRole {
	USER = 'user',
	ADMIN = 'admin',
	MODERATOR = 'moderator',
}

export interface UserType {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	password: string;
	role: UserRole;
	is_admin: boolean;
	created_at?: Date;
	updated_at?: Date;
}

// For API responses - exclude password
export interface PublicUserType {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	role: UserRole;
	is_admin: boolean;
	created_at?: Date;
}
