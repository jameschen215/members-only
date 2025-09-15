import { Client } from 'pg';
import bcrypt from 'bcrypt';

import { config } from './pool.js';

export async function seedDatabase() {
  console.log('Seeding...');

  const client = new Client(config);

  await client.connect();

  try {
    await client.query('BEGIN');
    // 1. Insert users
    const users = [
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        username: 'alicejohnson@company.com',
        password: '123456',
      },
      {
        firstName: 'Bob',
        lastName: 'Smith',
        username: 'bobsmith@company.com',
        password: '123456',
      },
      {
        firstName: 'Charlie',
        lastName: 'Brown',
        username: 'charliebrown@company.com',
        password: '123456',
      },
      {
        firstName: 'James',
        lastName: 'Chen',
        username: 'admin@company.com',
        password: '19342901',
      },
    ];

    for (const user of users) {
      const { firstName, lastName, username, password } = user;
      const hashedPassword = await bcrypt.hash(password, 10);

      await client.query(
        `
        INSERT INTO users (first_name, last_name, username, password)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING;
      `,
        [firstName, lastName, username, hashedPassword],
      );
    }

    // insert posts
    const posts = [
      {
        title: 'First Post',
        content: 'Excited to be part of this members-only app! 🎉',
        username: 'alicejohnson@company.com',
      },
      {
        title: 'Hello World',
        content:
          'This is my very first post here. Looking forward to meeting you all. 👋',
        username: 'bobsmith@company.com',
      },
      {
        title: 'Weekend Plans',
        content: 'Anyone up for a hiking trip this weekend? 🥾🌲',
        username: 'charliebrown@company.com',
      },
      {
        title: 'New Book Recommendation',
        content:
          "Just finished reading an amazing novel. 📚✨ Happy to share details if anyone's interested!",
        username: 'alicejohnson@company.com',
      },
      {
        title: 'Coding Tips',
        content:
          "Here's a neat trick I learned in JavaScript today. 💻🔧 Ask me if you want details.",
        username: 'bobsmith@company.com',
      },
      {
        title: 'Welcome!',
        content:
          "Hi everyone, I'm James, the creator of this app. 🚀 Thanks for joining — excited to see what you'll share here! 🙌",
        username: 'admin@company.com',
      },
    ];

    for (const post of posts) {
      const { title, content, username } = post;
      const userRes = await client.query(
        'SELECT id FROM users WHERE username = $1',
        [username],
      );
      const userId = (userRes.rows[0] as { id: number }).id;

      await client.query(
        `
        INSERT INTO messages (title, content, user_id)
        VALUES ($1, $2, $3)
        `,
        [title, content, userId],
      );
    }

    await client.query('COMMIT');
    console.log('Seeding completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.log('Seeding failed: ', error);
  } finally {
    await client.end();
    console.log('Database connect closed.');
  }
}
