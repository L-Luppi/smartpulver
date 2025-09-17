const { getAll, getById, insert, updateById} = require('../../utils/database');
const { success, notFound, serverError, corsResponse} = require('../../utils/response');

async function getAssinantes() {
    try {
        const assinantes = await getAll('assinante', '', [], 'nome');
        return success(assinantes);
    } catch (error) {
        return serverError(error);
    }
}

async function getAssinanteById(event) {
    try {
        const id = event.pathParameters.id;

        const assinante = await getById('assinante', id, '', 'id');
        if (!assinante) {
            return notFound('Assinante');
        }
        return success(assinante);
    } catch (error) {
        return serverError(error);
    }
}

async function createAssinante(event) {
    const body = JSON.parse(event.body);

    // validar campos obrigatórios
    if (!body.nome || !body.username || !body.email || !body.fone) {
        return corsResponse(400, {
            success: false,
            message: 'Nome, Nome de Usuário, email e fone obrigatório'
        });
    }

    try {
        const result = await insert('assinante', body);
        return corsResponse(201, {
            success: true,
            message: 'Novo assinante criado!',
            data: result
        })
    } catch (error) {
        return corsResponse(500, {
            success: false,
            message: error.message,
        })
    }
}

async function updateAssinante(event) {

    // tratar para campos não atualizaveis
    const body = JSON.parse(event.body);

    // validar campos obrigatórios
    //if (!body.nome || !body.username || !body.email || !body.fone) {
    //    return corsResponse(400, {
    //        success: false,
    //        message: 'Nome, Nome de Usuário, email e fone obrigatório'
    //    });
    //}

    // valida existência do assinante
    const id = event.pathParameters.id || body.id;

    if (!id) {
        return corsResponse(400, {
            success: false,
            message: 'ID do assinante é obrigatório'
        });
    }

    const exists = getAssinanteById(id)
    if (!exists) {
        return corsResponse(404, {
            success: false,
            message: "Assinante não cadastrado"
        });
    }

    try {
        const result = await updateById('assinante', id, body);
        return corsResponse(201, {
            success: true,
            message: 'Dados do Assinante atualizados!',
            data: result
        })
    } catch (error) {
        return corsResponse(500, {
            success: false,
            message: error.message,
        })
    }
}


module.exports = {
    getAssinantes,
    getAssinanteById,
    createAssinante,
    updateAssinante
};