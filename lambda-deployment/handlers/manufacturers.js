/* eslint-env node */
'use strict';

// Manufacturers handler module - Fixed imports
const { getAll, getById } = require('../utils/database');
const { success, error, notFound, serverError } = require('../utils/response');

/**
 * Get all manufacturers (public endpoint)
 */
async function getManufacturers(event, context) {
    try {
        console.log('Fetching manufacturers');

        const manufacturers = await getAll('manufacturers', '', [], 'name');

        console.log(`Found ${manufacturers.length} manufacturers`);

        return success(manufacturers);

    } catch (err) {
        console.error('Error fetching manufacturers:', err);
        return serverError(err);
    }
}

/**
 * Get manufacturer by ID (public endpoint)
 */
async function getManufacturerById(event, context) {
    try {
        const manufacturerId = event.pathParameters?.id;

        if (!manufacturerId) {
            return error('Manufacturer ID is required', 400);
        }

        const manufacturer = await getById('manufacturers', manufacturerId);

        if (!manufacturer) {
            return notFound('Manufacturer');
        }

        return success(manufacturer);

    } catch (err) {
        console.error('Error fetching manufacturer:', err);
        return serverError(err);
    }
}

module.exports = {
    getManufacturers,
    getManufacturerById
};