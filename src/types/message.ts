import { PublicUserType } from './user.js';

// ===== types/message.ts =====
export interface MessageType {
	id: number;
	title: string;
	content: string;
	user_id: number;
	created_at: Date;
	updated_at: Date;
}

// For API responses with author info
export interface MessageWithAuthor extends MessageType {
	author: PublicUserType;
}

// For creating new messages
export interface CreateMessageType {
	title: string;
	content: string;
	user_id: number;
}
