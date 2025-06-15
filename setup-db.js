import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './shared/schema.js';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://idec_user:a1fEVuo5TIiuI37YuslhIGbXOBvAKuMZ@dpg-d0smvsc9c44c73favrh0-a.oregon-postgres.render.com/idec';

async function main() {
  // Use SSL for cloud Postgres
  const sql = postgres(DATABASE_URL, { 
    max: 1, 
    ssl: 'require',
    idle_timeout: 20,
    connect_timeout: 10
  });
  const db = drizzle(sql, { schema });

  console.log('Reading current tables...');
  try {
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Current tables in DB:', tables.map(t => t.table_name));
  } catch (err) {
    console.error('Error reading tables:', err);
  }

  console.log('Running migrations (creating tables if missing)...');
  try {
    // Create tables if not exist, one at a time
    await sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      student_id VARCHAR(20) UNIQUE,
      username TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT NOT NULL,
      district TEXT NOT NULL,
      subcounty TEXT NOT NULL,
      village TEXT NOT NULL,
      education_level TEXT NOT NULL,
      course_type TEXT,
      role TEXT NOT NULL DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    await sql`CREATE TABLE IF NOT EXISTS permaculture_info (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      tags TEXT[],
      date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`;
    await sql`CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      instructor_id INTEGER NOT NULL REFERENCES users(id),
      is_approved BOOLEAN DEFAULT FALSE,
      is_public BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    await sql`CREATE TABLE IF NOT EXISTS enrollments (
      id SERIAL PRIMARY KEY,
      course_id INTEGER NOT NULL REFERENCES courses(id),
      student_id INTEGER NOT NULL REFERENCES users(id),
      enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'active'
    );`;
    // New table for group discussions
    await sql`CREATE TABLE IF NOT EXISTS group_discussions (
      id SERIAL PRIMARY KEY,
      course_id INTEGER NOT NULL REFERENCES courses(id),
      student_id INTEGER NOT NULL REFERENCES users(id),
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    console.log('Tables ensured.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }

  // Insert test users for each role
  try {
    const testUsers = [
      {
        username: 'student1', first_name: 'Test', last_name: 'Student', email: 'student1@example.com', password: 'password', phone: '1234567890', location: 'Test City', district: 'Test District', subcounty: 'Test Subcounty', village: 'Test Village', education_level: 'bachelors', course_type: 'online', role: 'student'
      },
      {
        username: 'instructor1', first_name: 'Test', last_name: 'Instructor', email: 'instructor1@example.com', password: 'password', phone: '1234567891', location: 'Test City', district: 'Test District', subcounty: 'Test Subcounty', village: 'Test Village', education_level: 'masters', course_type: 'physical', role: 'instructor'
      },
      {
        username: 'admin1', first_name: 'Test', last_name: 'Admin', email: 'admin1@example.com', password: 'password', phone: '1234567892', location: 'Test City', district: 'Test District', subcounty: 'Test Subcounty', village: 'Test Village', education_level: 'phd', course_type: 'online', role: 'admin'
      }
    ];
    for (const user of testUsers) {
      await sql`
        INSERT INTO users (username, first_name, last_name, email, password, phone, location, district, subcounty, village, education_level, course_type, role)
        VALUES (${user.username}, ${user.first_name}, ${user.last_name}, ${user.email}, ${user.password}, ${user.phone}, ${user.location}, ${user.district}, ${user.subcounty}, ${user.village}, ${user.education_level}, ${user.course_type}, ${user.role})
        ON CONFLICT (username) DO NOTHING
      `;
    }
    console.log('Test users inserted (if not already present).');
  } catch (err) {
    console.error('Error inserting test users:', err);
  }

  await sql.end();
}

main().catch(console.error);