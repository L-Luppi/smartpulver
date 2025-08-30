const { getAll, getById } = require('../../utils/database');
const { success, notFound, serverError } = require('../../utils/response');

async function getProdutos() {
    try {
        console.log('Fetching agrofit produtos');
        const produtos = await getAll('agrofit_produto', '', [], 'marca_comercial');
        return success(produtos);
    } catch (error) {
        console.error('getProdutos error:', error);
        return serverError(error);
    }
}

async function getProdutoById(event) {
    try {
        const numero_registro = event.pathParameters.id;
        console.log('Fetching produto by ID:', numero_registro);

        const produto = await getById('agrofit_produto', numero_registro, '', 'numero_registro');
        if (!produto) {
            return notFound('Produto');
        }
        return success(produto);
    } catch (error) {
        console.error('getProdutoById error:', error);
        return serverError(error);
    }
}

module.exports = {
    getProdutos,
    getProdutoById
};