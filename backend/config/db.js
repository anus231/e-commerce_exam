const { Pool } = require('pg');

const path = require('path');
const fs = require('fs');

let dbType = 'sqlite';
let pgPool = null;
let sqliteDb = null;

// Initialize Database connection based on environment variables
if (process.env.DB_HOST || process.env.DATABASE_URL) {
  dbType = 'postgres';
  const config = process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
      };
  
  pgPool = new Pool(config);
  console.log('Database connected: PostgreSQL');
} else {
  const sqlite3 = require('sqlite3').verbose();
  dbType = 'sqlite';

  const dbPath = path.join(__dirname, '..', 'database.db');
  const dbExists = fs.existsSync(dbPath);
  
  sqliteDb = new sqlite3.Database(dbPath);
  console.log(`Database connected: SQLite (${dbPath})`);
  
  // If the database is brand new, auto-initialize with schema and seed data
  if (!dbExists) {
    console.log('Initializing new SQLite database...');
    initializeSqlite();
  }
}

function initializeSqlite() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
  
  try {
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    // Translate Postgres SERIAL and TIMESTAMP syntax to SQLite compatibility
    schemaSql = schemaSql
      .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
      .replace(/DECIMAL\(\d+,\s*\d+\)/gi, 'NUMERIC');

    let seedSql = fs.readFileSync(seedPath, 'utf8');
    
    sqliteDb.serialize(() => {
      // Split and run DDL commands
      schemaSql.split(';').forEach(query => {
        if (query.trim()) {
          sqliteDb.run(query);
        }
      });
      console.log('SQLite schema applied.');

      // Split and run DML seed commands
      const seedQueries = seedSql.split(';');
      seedQueries.forEach(query => {
        if (query.trim()) {
          sqliteDb.run(query);
        }
      });
      console.log('SQLite seed data loaded.');
    });
  } catch (error) {
    console.error('Failed to initialize SQLite database:', error);
  }
}

// Unified query wrapper
async function query(text, params = []) {
  if (dbType === 'postgres') {
    return await pgPool.query(text, params);
  } else {
    // Translate PostgreSQL $1, $2 placeholders to SQLite ? placeholders
    const sqliteText = text.replace(/\$\d+/g, '?');
    
    return new Promise((resolve, reject) => {
      const isSelect = sqliteText.trim().toLowerCase().startsWith('select');
      
      if (isSelect) {
        sqliteDb.all(sqliteText, params, (err, rows) => {
          if (err) {
            console.error('SQLite Select Error:', err, 'Query:', sqliteText, 'Params:', params);
            reject(err);
          } else {
            resolve({ rows, rowCount: rows.length });
          }
        });
      } else {
        sqliteDb.run(sqliteText, params, function(err) {
          if (err) {
            console.error('SQLite Run Error:', err, 'Query:', sqliteText, 'Params:', params);
            reject(err);
          } else {
            resolve({ 
              rows: [], 
              rowCount: this.changes,
              insertId: this.lastID
            });
          }
        });
      }
    });
  }
}

// Transaction execution wrapper
async function transaction(callback) {
  if (dbType === 'postgres') {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      // Create a query wrapper that uses this specific client
      const trxQuery = async (text, params = []) => {
        return await client.query(text, params);
      };
      const result = await callback(trxQuery);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } else {
    // SQLite
    try {
      await query('BEGIN TRANSACTION');
      
      // For SQLite, we can just use the global query function as it runs sequentially 
      // on the same database connection file
      const result = await callback(query);
      
      await query('COMMIT');
      return result;
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  }
}

module.exports = {
  query,
  transaction,
  dbType,
  getPool: () => pgPool,
  getSqlite: () => sqliteDb
};
