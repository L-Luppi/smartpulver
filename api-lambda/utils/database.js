const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// Connection pool
let pool = null;

/**
 * Get database connection pool
 */
function getPool() {
    if (!pool) {
        console.log('Creating new database connection pool');
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

/**
 * Execute a database query
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
async function executeQuery(query, params = []) {
    try {
        const connection = getPool();
        console.log('Executing query:', query, 'with params:', params);
        const [rows] = await connection.execute(query, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error(`Database error: ${error.message}`);
    }
}

/**
 * Get a single record by ID
 * @param {string} table - Table name
 * @param {number|string} id - Record ID
 * @param {string} [condition=''] - Additional WHERE condition
 * @param {string} [idColumn='id'] - The name of the ID column
 * @returns {Promise<Object|null>} Single record or null
 */
async function getById(table, id, condition = '', idColumn = 'id') {
    const whereClause = condition ? `${idColumn} = ? AND ${condition}` : `${idColumn} = ?`;
    const query = `SELECT * FROM ${table} WHERE ${whereClause}`;
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? rows[0] : null;
}

/**
 * Get all records from a table with optional conditions
 * @param {string} table - Table name
 * @param {string} condition - WHERE condition
 * @param {Array} params - Query parameters
 * @param {string} orderBy - ORDER BY clause
 * @returns {Promise<Array>} Array of records
 */
async function getAll(table, condition = '', params = [], orderBy = '') {
    let query = `SELECT * FROM ${table}`;
    if (condition) {
        query += ` WHERE ${condition}`;
    }
    query += ` ORDER BY ${orderBy}`;

    return await executeQuery(query, params);
}

/**
 * Insert a new record
 * @param {string} table - Table name
 * @param {Object} data - Data to insert
 * @returns {Promise<Object>} Insert result
 */
async function insert(table, data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    try {
        const connection = getPool();
        const [result] = await connection.execute(query, values);

        return {
            insertId: result.insertId,
            affectedRows: result.affectedRows
        };
    } catch (error) {
        console.error('Database insert error:', error);
        throw new Error(`Database insert error: ${error.message}`);
    }
}

/**
 * Update a record by ID
 * @param {string} table - Table name
 * @param {number|string} id - Record ID
 * @param {Object} data - Data to update
 * @returns {Promise<Object>} Update result
 */
async function updateById(table, id, data) {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];

    const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;

    try {
        const connection = getPool();
        const [result] = await connection.execute(query, values);

        return {
            affectedRows: result.affectedRows
        };
    } catch (error) {
        console.error('Database update error:', error);
        throw new Error(`Database update error: ${error.message}`);
    }
}

/**
 * Delete a record by ID
 * @param {string} table - Table name
 * @param {number|string} id - Record ID
 * @returns {Promise<Object>} Delete result
 */
async function deleteById(table, id) {
    const query = `DELETE FROM ${table} WHERE id = ?`;

    try {
        const connection = getPool();
        const [result] = await connection.execute(query, [id]);

        return {
            affectedRows: result.affectedRows
        };
    } catch (error) {
        console.error('Database delete error:', error);
        throw new Error(`Database delete error: ${error.message}`);
    }
}

// Export all functions
module.exports = {
    getPool,
    executeQuery,
    getById,
    getAll,
    insert,
    updateById,
    deleteById
};
