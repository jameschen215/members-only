import { pool } from '../db/pool.js';
import { MessageType } from '../types/message.js';

export async function getAllMessages(): Promise<MessageType[]> {
  const { rows }: { rows: MessageType[] } = await pool.query(
    `SELECT * FROM messages ORDER BY updated_at;`,
  );

  return rows;
}

export async function createMessage(
  title: string,
  content: string,
  user_id: number,
): Promise<MessageType> {
  const { rows }: { rows: MessageType[] } = await pool.query(
    `INSERT INTO messages (title, content, user_id)
    VALUES ($1, $2, $3) RETURNING *`,
    [title, content, user_id],
  );

  return rows[0];
}
