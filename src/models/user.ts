import { pool } from "../db/pool.js";
import { UserType } from "../types/user.js";

export async function getUserByUsername(
  username: string,
): Promise<UserType | null> {
  const { rows } = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  return rows[0] || null;
}

export async function getUserById(id: number): Promise<UserType | null> {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

  return rows[0] || null;
}

export async function createUser(
  firstName: string,
  lastName: string,
  username: string,
  hashedPassword: string,
): Promise<UserType> {
  const { rows } = await pool.query(
    `INSERT INTO users (first_name, last_name, username, password)
    VALUES ($1, $2, $3, $4) RETURNING *`,
    [firstName, lastName, username, hashedPassword],
  );

  return rows[0];
}
