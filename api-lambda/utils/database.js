import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // Pool settings
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    //connections settings
    timeout: 60000,
    charset: 'utf8mb4',
};

// Connection pool
let pool = null;

/**
 * Get database connection pool
 */
export function getPool() {
    if (!pool) {
        // console.log('Creating new database connection pool');
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

export async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}

/**
 * Execute a database query
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
export async function executeQuery(query, params = []) {
    try {
        const connection = getPool();
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
export async function getById(table, id, condition = '', idColumn = 'id') {
    const whereClause = condition ? `${idColumn} = ? AND ${condition}` : `${idColumn} = ?`;
    const query = `SELECT * FROM ${table} WHERE ${whereClause}`;
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? rows[0] : null;
}

export async function getCount(table, condition = '', params = []) {
    try {
        let query = `SELECT COUNT(*) as total FROM ${table}`;

        if (condition) {
            query += ` WHERE ${condition}`;
        }

        const rows = await executeQuery(query, params);
        return rows[0].total;
    } catch (error) {
        console.error('getCount error:', error);
        throw error;
    }
}

// Enhanced getAll with pagination and ordering support
/**
 * Get all records from a table with optional conditions
 * @param {string} table - Table name
 * @param {string} condition - WHERE condition
 * @param {Array} params - Query parameters
 * @param {number} limit - Max rows to return
 * @param {number} offset - Number of rows to skip
 * @param {string} orderBy - ORDER BY clause
 * @returns {Promise<Array>} Array of records
 */
export async function getAll(table, condition = '', params = [], limit = null, offset = 0, orderBy = 'id ASC') {
    try {
        let query = `SELECT * FROM ${table}`;

        if (condition) {
            query += ` WHERE ${condition}`;
        }

        // Add ordering (always include for consistent results)
        query += ` ORDER BY ${orderBy}`;

        // Add pagination if limit is specified
        if (limit) {
            query += ` LIMIT ${limit}`;
            if (offset > 0) {
                query += ` OFFSET ${offset}`;
            }
        }

        return await executeQuery(query, params);

    } catch (error) {
        console.error('getAll error:', error);
        throw error;
    }
}

/**
 * Insert a new record
 * @param {string} table - Table name
 * @param {Object} data - Data to insert
 * @returns {Promise<Object>} Insert result
 */
export async function insert(table, data) {
    try {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map(() => '?').join(', ');

        const query = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
        const result = await executeQuery(query, values);

        // Return the inserted record
        if (result.insertId) {
            return await getById(table, result.insertId);
        }
        return result;
    } catch (error) {
        console.error('insert error:', error);
        throw error;
    }
}

/**
 * Update a record by ID
 * @param {string} table - Table name
 * @param {number|string} id - Record ID
 * @param {Object} data - Data to update
 * @param {string} idColumn - Coluna chave
 * @returns {Promise<Object>} Update result
 */

export async function updateById(table, id, data, idColumn = 'id') {
    try {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map(field => `${field} = ?`).join(', ');

        const query = `UPDATE ${table} SET ${setClause} WHERE ${idColumn} = ?`;
        await executeQuery(query, [...values, id]);

        // Return the updated record
        return await getById(table, id, '', idColumn);
    } catch (error) {
        console.error('updateById error:', error);
        throw error;
    }
}

/**
 * Delete a record by ID
 * @param {string} table - Table name
 * @param {number|string} id - Record ID
 * @returns {Promise<Object>} Delete result
 */
/*
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
*/