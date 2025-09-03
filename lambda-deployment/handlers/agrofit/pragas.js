// Agrofit pragas handler module - Fixed imports
const { getAll, getById } = require('../../utils/database');
const { success, error, notFound, serverError } = require('../../utils/response');

/**
 * Get all active agrofit pests
 */
async function getPragas(event, context) {
    try {
        console.log('Fetching agrofit pragas');

        const pragas = await getAll('agrofit_pragas', 'is_active = 1', [], 'name');

        console.log(`Found ${pragas.length} active pragas`);

        return success(pragas);

    } catch (err) {
        console.error('Error fetching pragas:', err);
        return serverError(err);
    }
}

/**
 * Get specific agrofit pest by ID
 */
async function getPragaById(event, context) {
    try {
        const pragaId = event.pathParameters?.id;

        if (!pragaId) {
            return error('Praga ID is required', 400);
        }

        const praga = await getById('agrofit_pragas', pragaId, 'is_active = 1');

        if (!praga) {
            return notFound('Praga');
        }

        return success(praga);

    } catch (err) {
        console.error('Error fetching praga:', err);
        return serverError(err);
    }
}

module.exports = {
    getPragas,
    getPragaById
};