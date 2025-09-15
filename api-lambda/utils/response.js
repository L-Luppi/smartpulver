'use strict';
/**
 * Standard CORS headers
 */
const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

/**
 * Create a success response
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {Object} additionalHeaders - Additional headers
 * @returns {Object} Lambda response object
 */
function success(data, statusCode = 200, additionalHeaders = {}) {
    const response = {
        success: true,
        data,
        timestamp: new Date().toISOString()
    };

    // Add count for arrays
    if (Array.isArray(data)) {
        response.count = data.length;
    }

    return {
        statusCode,
        headers: { ...corsHeaders, ...additionalHeaders },
        body: JSON.stringify(response)
    };
}

/**
 * Create a paginated success response
 * @param {Array} items - Array of items
 * @param {number} total - Total count
 * @param {number} limit - Items per page
 * @param {number} offset - Offset
 * @param {number} statusCode - HTTP status code
 * @param {Object} additionalHeaders - Additional headers
 * @returns {Object} Lambda response object
 */
function paginatedSuccess(items, total, limit, offset, statusCode = 200, additionalHeaders = {}) {
    const response = {
        success: true,
        data: {
            items,
            total,
            limit,
            offset,
            count: items.length
        },
        timestamp: new Date().toISOString()
    };

    return {
        statusCode,
        headers: { ...corsHeaders, ...additionalHeaders },
        body: JSON.stringify(response)
    };
}

/**
 * Create an error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {Object} additionalData - Additional error data
 * @returns {Object} Lambda response object
 */
function error(message, statusCode = 400, additionalData = {}) {
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify({
            success: false,
            error: message,
            timestamp: new Date().toISOString(),
            ...additionalData
        })
    };
}

/**
 * Create a not found response
 * @param {string} resource - Resource name
 * @returns {Object} Lambda response object
 */
function notFound(resource = 'Resource') {
    return error(`${resource} not found`, 404);
}

/**
 * Create an unauthorized response
 * @param {string} message - Custom message
 * @returns {Object} Lambda response object
 */
function unauthorized(message = 'Unauthorized access') {
    return error(message, 401);
}

/**
 * Create a server error response
 * @param {Error} err - Error object
 * @returns {Object} Lambda response object
 */
function serverError(err) {
    console.error('Server error:', err);

    const message = err instanceof Error ? err.message : 'Unknown error';

    return error('Internal server error', 500, {
        details: process.env.NODE_ENV === 'development' ? message : undefined
    });
}

/**
 * Create a CORS response - handles both preflight OPTIONS and regular responses
 * @param {number} statusCode - HTTP status code (optional for OPTIONS)
 * @param {*} body - Response body (optional for OPTIONS)
 * @returns {Object} Lambda response object
 */
function corsResponse(statusCode, body) {
    if (statusCode === undefined && body === undefined) {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify(body)
    };
}

/**
 * Create a validation error response
 * @param {string} message - Error message
 * @param {Object} errors - Validation errors
 * @returns {Object} Lambda response object
 */
function validationError(message, errors = {}) {
    return error(message, 400, { validationErrors: errors });
}

// Export all functions
module.exports = {
    success,
    paginatedSuccess,
    error,
    notFound,
    unauthorized,
    serverError,
    corsResponse,
    validationError
};
