const { getAll, getById } = require('../../utils/database');
const { success, notFound, serverError } = require('../../utils/response');

async function getCulturas() {
    try {
        console.log('Fetching agrofit culturas');
        const culturas = await getAll('agrofit_cultura', '', [], 'nome');
        return success(culturas);
    } catch (error) {
        console.error('getCulturas error:', error);
        return serverError(error);
    }
}

async function getCulturaById(event) {
    try {
        const id = event.pathParameters.id;
        console.log('Fetching cultura by ID:', id);

        const cultura = await getById('agrofit_cultura', id, '', 'id');
        if (!cultura) {
            return notFound('Cultura');
        }
        return success(cultura);
    } catch (error) {
        console.error('getCulturaById error:', error);
        return serverError(error);
    }
}

module.exports = {
    getCulturas,
    getCulturaById
};