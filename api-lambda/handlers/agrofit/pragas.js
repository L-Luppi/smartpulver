const { getAll, getById } = require('../../utils/database');
const { success, notFound, serverError } = require('../../utils/response');

async function getPragas() {
    try {
        console.log('Fetching agrofit pragas');
        const pragas = await getAll('agrofit_praga_comum', '', [], 'nome_comum');
        return success(pragas);
    } catch (error) {
        console.error('getPragas error:', error);
        return serverError(error);
    }
}

async function getPragaById(event) {
    try {
        const id = event.pathParameters.id;
        console.log('Fetching praga by ID:', id);

        const praga = await getById('agrofit_praga_comum', id, '', 'id');
        if (!praga) {
            return notFound('Praga');
        }
        return success(praga);
    } catch (error) {
        console.error('getPragaById error:', error);
        return serverError(error);
    }
}

module.exports = {
    getPragas,
    getPragaById
};