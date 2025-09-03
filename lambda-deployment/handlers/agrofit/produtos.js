// Agrofit produtos handler module - Fixed imports
const { getAll, getById } = require('../../utils/database');
const { success, error, notFound, serverError } = require('../../utils/response');

/**
 * Get all active agrofit products
 */
async function getProdutos(event, context) {
    try {
        console.log('Fetching agrofit produtos');

        const produtos = await getAll('agrofit_produtos', 'is_active = 1', [], 'name');

        console.log(`Found ${produtos.length} active produtos`);

        return success(produtos);

    } catch (err) {
        console.error('Error fetching produtos:', err);
        return serverError(err);
    }
}

/**
 * Get specific agrofit product by ID
 */
async function getProdutoById(event, context) {
    try {
        const produtoId = event.pathParameters?.id;

        if (!produtoId) {
            return error('Produto ID is required', 400);
        }

        const produto = await getById('agrofit_produtos', produtoId, 'is_active = 1');

        if (!produto) {
            return notFound('Produto');
        }

        return success(produto);

    } catch (err) {
        console.error('Error fetching produto:', err);
        return serverError(err);
    }
}

module.exports = {
    getProdutos,
    getProdutoById
};