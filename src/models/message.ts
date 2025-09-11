import { pool } from '../db/pool.js';
import { MessageType, MessageWithAuthor } from '../types/message.js';

export async function getAllMessages(
  q: string = '',
): Promise<MessageWithAuthor[]> {
  const queryParams = [];
  let query = `
    SELECT 
      m.id, m.title, m.content, m.user_id, m.created_at, m.updated_at,
      u.id AS author_id, u.first_name, u.last_name, u.username, u.role, u.created_at AS user_created_at, u.updated_at AS user_updated_at
    FROM messages m
    JOIN users u ON m.user_id = u.id
  `;

  if (q) {
    query += `
     WHERE m.title ILIKE $1 OR m.content ILIKE $1
    `;
    queryParams.push(`%${q}%`);
  }

  query += 'ORDER BY m.created_at DESC;';

  const { rows } = await pool.query(query, queryParams);

  const messages = rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    user_id: row.user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: {
      id: row.author_id,
      first_name: row.first_name,
      last_name: row.last_name,
      username: row.username,
      role: row.role,
      created_at: row.user_created_at,
      updated_at: row.user_updated_at,
      avatar: row.first_name.charAt(0) + row.last_name.charAt(0),
    },
  })) as MessageWithAuthor[];

  return messages;
}

export async function getMessagesByUserId(
  userId: number,
): Promise<MessageType[]> {
  const { rows }: { rows: MessageType[] } = await pool.query(
    `SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
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

export async function deleteMessageById(id: number): Promise<MessageType> {
  const { rows } = await pool.query(
    'DELETE FROM messages WHERE id = $1 RETURNING *',
    [id],
  );

  return rows[0];
}
