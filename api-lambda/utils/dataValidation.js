import { corsHeaders } from './response.js';

export function filterAllowedFields(data, allowedFields) {
    return Object.keys(data)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
        }, {});
}

export function validateRequiredFields(data, requiredFields) {
    const missing = [];
    const empty = [];

    for (const field of requiredFields) {
        if (!(field in data)) {
            missing.push(field);
        } else if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            empty.push(field);
        }
    }

    return { missing, empty, isValid: missing.length === 0 && empty.length === 0 };
}

export function validateRestrictedFields(data, restrictedFields) {
    const restricted = restrictedFields.filter(field => field in data);
    return { restricted, isValid: restricted.length === 0 };
}

export function validateFieldValues(data, allowedValues) {
    const validValues = allowedValues.filter(value => value in data);
    return {validValues, isValid: validValues.length === 0}
}

export function createErrorResponse(statusCode, errorType, message, details = null) {
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify({
            success: false,
            error: {
                type: errorType,
                message: message,
                details: details
            }
        })
    };
}
