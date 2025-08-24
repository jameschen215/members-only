import { Client } from 'pg';
import { config as dbConfig } from './pool.js';

export async function initializeDatabase() {
	const client = new Client(dbConfig);

	try {
		// Connect to database
		console.log('Connecting to database...');
		await client.connect();
		console.log('Connected successfully');

		// Drop existing tables and enums if existing
		console.log('Drop existing tables...');
		await client.query(`
      DROP TABLE IF EXISTS
        messages,
        user_sessions,
        users
      CASCADE;

      DROP TYPE IF EXISTS user_role CASCADE;
    `);

		// Create the enum type first, separately
		console.log('Creating enum type for user roles...');
		await client.query(`
      CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
    `);

		//  Create table users
		console.log('Creating tables...');
		console.log('Creating users table...');
		await client.query(`
      CREATE TABLE users (
        id integer primary key generated always as identity,
        first_name varchar(255) not null,
        last_name varchar(255) not null,
        username varchar(255) unique not null,
        password varchar(255) not null,
        role user_role not null default 'user',
        is_admin boolean not null default false,
        created_at timestamp with time zone default current_timestamp,
        updated_at timestamp with time zone default current_timestamp
      );
    `);

		// Create sessions table
		console.log('Creating user sessions table...');
		await client.query(`
      CREATE TABLE user_sessions (
        sid varchar not null,
        sess json not null,
        expire timestamp(6) not null
      )
      WITH (oids=false);
    `);

		// Add constraints and indexes
		await client.query(`
      ALTER TABLE user_sessions ADD CONSTRAINT session_pkey 
        PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;

      CREATE INDEX idx_session_expire ON user_sessions (expire);
      CREATE INDEX idx_users_username ON users (username);
      CREATE INDEX idx_users_first_name ON users (first_name);
      CREATE INDEX idx_users_role ON users (role);
      CREATE INDEX idx_users_is_admin ON users (is_admin);
    `);

		// Function to automatically set is_admin based on role
		console.log('Creating trigger function...');
		await client.query(`
      CREATE OR REPLACE FUNCTION update_is_admin()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.is_admin = (NEW.username IN ('jameschen215@outlook.com', 'admin@company.com'));
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

		// Trigger to automatically update is_admin when role changes
		console.log('Creating trigger...');
		await client.query(`
      CREATE TRIGGER trigger_update_is_admin
        BEFORE INSERT OR UPDATE OF role ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_is_admin();
    `);

		// Create messages table
		console.log('Creating messages table...');
		await client.query(`
      CREATE TABLE messages (
        id integer primary key generated always as identity,
        title varchar(255) not null,
        content text not null,
        created_at timestamp with time zone default current_timestamp,
        updated_at timestamp with time zone default current_timestamp,
        user_id integer not null,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `);

		// Create indexes for messages table
		console.log('Creating indexes for messages table...');
		await client.query(`
      CREATE INDEX idx_messages_user_id ON messages (user_id);
      CREATE INDEX idx_messages_created_at ON messages (created_at);
    `);

		console.log('Database initialization completed successfully');
	} catch (error) {
		const err = error as { message?: string; code?: string; detail?: string };

		console.error('Database initialization error details', {
			message: err.message,
			code: err.code,
			detail: err.detail,
		});

		throw error;
	} finally {
		await client.end();
		console.log('Database connection closed');
	}
}
