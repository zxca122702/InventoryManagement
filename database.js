const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to Neon database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Neon database successfully');
    
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Users table created/verified');
    client.release();
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
};

// Initialize database
const initializeDatabase = async () => {
  try {
    await testConnection();
    
    // Check if admin user exists, if not create it
    const client = await pool.connect();
    const adminCheck = await client.query('SELECT * FROM users WHERE username = $1', ['admin']);
    
    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin', 10);
      
      await client.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
        ['admin', hashedPassword, 'admin']
      );
      
      console.log('✅ Default admin user created (username: admin, password: admin)');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    client.release();
  } catch (err) {
    console.error('❌ Database initialization error:', err);
  }
};

// User authentication functions
const authenticateUser = async (username, password) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    client.release();
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (isValidPassword) {
      return {
        id: user.id,
        username: user.username,
        role: user.role
      };
    }
    
    return null;
  } catch (err) {
    console.error('Authentication error:', err);
    return null;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  authenticateUser
};