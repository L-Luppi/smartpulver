const { getAll, getById, insert, updateById, getCount} = require('../../utils/database');
const { success, notFound, serverError, corsResponse} = require('../../utils/response');
const { getLocationData } = require('../../utils/locationService');

async function getAssinantes(event) {
    try {
        const queryParams = event.queryStringParameters || {};
        const {
            limit = 50,
            offset = 0,
            status,
            orderBy = 'nome',
            sortBy = 'nome',
            sortOrder = 'ASC'
        } = queryParams;

        let condition = '';
        const params = [];

        if (status !== undefined) {
            const validStatus = ['ativo', 'inativo', 'cancelado'];
            if (validStatus.includes(status.toLowerCase())) {
                condition = 'status = ?';
                params.push(status.toLowerCase());
            } else {
                return serverError('Invalid Status', 400);
            }
        }

        let orderClause = orderBy;
        if (sortBy) {
            const allowedSortFields = ['id', 'nome', 'user_name'];
            const allowedSortOrder = ['ASC', 'DESC'];

            if (allowedSortFields.includes(sortBy) && allowedSortOrder.includes(sortOrder.toUpperCase())) {
                orderClause = `${sortBy} ${sortOrder.toUpperCase()}`;
            }
        }

        const [result, totalCount] = await Promise.all([
            getAll('assinante', condition, params, parseInt(limit), parseInt(offset), orderClause),
            getCount('assinante', condition, params)
        ]);

        const enrichedResult = await getLocationData(result, 'id_cidadeIBGE');

        return success({
            data: enrichedResult,
            pagination: {
                total: totalCount,
                count: result.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + result.length) < totalCount,
            },
            sorting: {
                orderBy: orderClause
            }
        });

    } catch (error) {
        console.error('GET Assinantes Error:', error);
        return serverError('Failed to fetch assinantes');
    }
}

async function getAssinanteById(event) {
    try {
        const id = event.routeParams?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        const result = await getById('assinante', id, '', 'id');
        if (!result) {
            return notFound('Assinante');
        }
        console.log('DEBUG - retorno do getById', result)
        const enrichedResult = await getLocationData(result, 'id_cidadeIBGE');

        return success(enrichedResult);

    } catch (error) {
        console.error('GET Assinante By ID Error:', error);
        return serverError('Failed to fetch assinante');
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