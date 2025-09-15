const { getAll, getById, insert, updateById} = require('../../utils/database');
const { success, notFound, serverError, corsResponse} = require('../../utils/response');

async function getPlanos() {
    try {
        const planos = await getAll('plano', '', [], 'nome');
        return success(planos);
    } catch (error) {
        return serverError(error);
    }
}

async function getPlanoById(event) {
    try {
        const id = event.pathParameters.id;

        const plano = await getById('plano', id, '', 'id');
        if (!plano) {
            return notFound('Plano de Assinatura');
        }
        return success(plano);
    } catch (error) {
        return serverError(error);
    }
}

async function createPlano(event) {
    const body = JSON.parse(event.body);

    // validar campos obrigatórios
    if (!body.nome || body.nome.trim() === '') {
        return corsResponse(400, {
            success: false,
            message: 'Nome do Plano de Assinatura não pode estar em branco'
        })
    }
    if (!body.display_name || body.display_name.trim() === '') {
        return corsResponse(400, {
            success: false,
            message: 'Nome para exibição do Plano de Assinatura não pode estar em branco'
        });
    }

    try {
        const enhancedBody = {
            ...body,
            createdAt: new Date().toISOString(),
            status: 'ativo'
        }
        const result = await insert('plano', enhancedBody);
        return corsResponse(201, {
            success: true,
            message: 'Novo Plano Criado!',
            data: result
        })
    } catch (error) {
        return corsResponse(500, {
            success: false,
            message: error.message,
        })
    }
}

async function updatePlano(event) {
    const id = event.pathParameters.id;

    try {
        let bodyData;
        try {
            bodyData = JSON.parse(event.body || '{}');
        } catch (parseError) {
            return corsResponse(400, {
                success: false,
                message: `Invalid JSON in request body ${parseError}`
            })
        }

        // para tratar campos que podem ser atualizados
        //const allowedFields = ['nome', 'display_name', 'descricao', 'status'];
        //const filteredData = Object.keys(bodyData)
        //                    .filter(key => allowedFields.includes(key))
        //                    .reduce((obj, key) => {
        //                        obj[key] = bodyData[key];
        //                        return obj;
        //                     }, {});
        // falta complementar ainda mas o processo base é esse

        const enhancedBody = {
            ...bodyData,
            updatedAt: new Date().toISOString(),
        }
        const result = await updateById('plano', id, enhancedBody);
        return corsResponse(200, {
            success: true,
            message: 'Plano de Assinatura Atualizado!',
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
    getPlanos,
    getPlanoById,
    createPlano,
    updatePlano
};