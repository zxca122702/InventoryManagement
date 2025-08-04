// database.js
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function initializeDatabase() {
  // optional: setup DB, create tables, etc.
  await sql`SELECT 1`;
}

async function authenticateUser(username, password) {
  const result = await sql`SELECT * FROM users WHERE username = ${username}`;
  const user = result[0];
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  return null;
}

module.exports = {
  sql,
  initializeDatabase,
  authenticateUser
};
