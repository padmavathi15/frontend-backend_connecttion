const { Pool } = require('pg');

// PostgreSQL database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'frontend-backend', // Replace with your database name
  password: 'padma_postgres',
  port: 5432,
});

module.exports = pool;
