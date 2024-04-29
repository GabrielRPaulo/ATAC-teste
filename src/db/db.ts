import { Pool } from 'pg';

const pool = new Pool({
    user: 'docker',
    host: 'localhost', 
    database: 'atac',
    password: 'docker', 
    port: 5432, 
});

async function createTables(): Promise<void> {
    try {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT 1
          FROM   information_schema.tables 
          WHERE  table_schema = 'public'
          AND    table_name = 'users'
        ) AS users_exists
      `);
  
      if (!result.rows[0].users_exists) {
        await pool.query(`
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL
            
          )
        `);
        console.log('Users table created');
      }
    } catch (error) {
        console.error('Error creating tables:', error);
      }
    }
export { pool, createTables };
