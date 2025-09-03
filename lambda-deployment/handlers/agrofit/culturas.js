// Agrofit culturas handler module - Fixed imports
const { getAll, getById } = require('../../utils/database');
const { success, error, notFound, serverError } = require('../../utils/response');

/**
 * Get all active agrofit cultures
 */
async function getCulturas(event, context) {
    try {
        console.log('Fetching agrofit culturas');

        const culturas = await getAll('agrofit_culturas', 'is_active = 1', [], 'name');

        console.log(`Found ${culturas.length} active culturas`);

        return success(culturas);

    } catch (err) {
        console.error('Error fetching culturas:', err);
        return serverError(err);
    }
}

/**
 * Get specific agrofit culture by ID
 */
async function getCulturaById(event, context) {
    try {
        const culturaId = event.pathParameters?.id;

        if (!culturaId) {
            return error('Cultura ID is required', 400);
        }

        const cultura = await getById('agrofit_culturas', culturaId, 'is_active = 1');

        if (!cultura) {
            return notFound('Cultura');
        }

        return success(cultura);

    } catch (err) {
        console.error('Error fetching cultura:', err);
        return serverError(err);
    }
}

module.exports = {
    getCulturas,
    getCulturaById
};