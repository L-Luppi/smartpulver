const { getAll, getById, insert, updateById, getCount} = require('../../utils/database');
const { success, notFound, serverError } = require('../../utils/response');

// GET /api/v1/smart/plans
async function getPlanos(event) {
    try {

        const queryParams = event.queryStringParameters || {};
        const {
            limit = 50,
            offset = 0,
            status,
            orderBy = 'display_name',
            sortBy = 'display_name',
            sortOrder = 'ASC'
        } = queryParams;

        let condition = '';
        const params = [];

        if (status !== undefined) {
            const validStatus = ['ativo', 'inativo', 'cancelado', 'promo', 'suspenso'];
            if (validStatus.includes(status.toLowerCase())) {
                condition = 'status = ?';
                params.push(status.toLowerCase());
            } else {
                return serverError('Invalid Status', 400);
            }
        }

        let orderClause = orderBy;
        if (sortBy) {
            const allowedSortFields = ['id', 'nome', 'display_name', 'valor_atual', 'updatedAt', 'createdAt' ];
            const allowedSortOrder = ['ASC', 'DESC'];

            if (allowedSortFields.includes(sortBy) && allowedSortOrder.includes(sortOrder.toUpperCase())) {
                orderClause = `${sortBy} ${sortOrder.toUpperCase()}`;
            }
        }

        const [result, totalCount] = await Promise.all([
            getAll('plano', condition, params, parseInt(limit), parseInt(offset), orderClause),
            getCount('plano', condition, params)
        ]);

        return success({
            data: result,
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
        console.error('GET Plans Error:', error);
        return serverError('Failed to fetch plans');
    }
}

// GET /api/v1/smart/plans/{id}
async function getPlanoById(event) {

    try {
        const id = event.routeParams?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        const result = await getById('plano', id, '', 'id');

        if (!result) {
            return notFound('Plano not found');
        }

        return success({ data: result });

    } catch (error) {
        console.error('GET Plan By ID Error:', error);
        return serverError('Failed to fetch plan');
    }
}

// POST /api/v1/smart/plans
async function createPlano(event) {
    try {

        const body = JSON.parse(event.body || '{}');

        // Validate required fields
        const requiredFields = ['nome', 'display_name', 'duracao_dias', 'valor_atual'];
        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            return serverError(`Missing required fields: ${missingFields.join(', ')}`, 400);
        }

        // Prepare data (only allow specific fields)
        const allowedFields = ['nome', 'display_name', 'descricao', 'duracao_dias', 'valor_atual', 'createdAt', 'updatedAt', 'status'];

        const data = {};
        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                data[field] = body[field];
            }
        });

        // Set defaults
        if (data.createdAt === undefined) data.createdAt = Date.now();
        if (data.updatedAt === undefined) data.updatedAt = Date.now();
        if (data.status === undefined) data.status = 'ativo';

        const result = await insert('plano', data);

        return success({
            data: result,
            message: 'Novo plano criado!'
        }, 201);

    } catch (error) {
        console.error('CREATE Plan Error:', error);
        return serverError('Failed to create plan');
    }
}

async function updatePlano(event) {
    try {
        //const id = event.pathParameters?.pathParameters?.id;  // Make sure this matches your route
        const id = event.routeParams?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        const body = JSON.parse(event.body || '{}');

        // Prepare data (only allow specific fields)
        const allowedFields = ['nome', 'display_name', 'descricao', 'duracao_dias', 'valor_atual', 'updatedAt', 'status'];
        const data = {};

        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                data[field] = body[field];
            }
        });

        // Special validation for status field
        if (data.status !== undefined) {
            const validStatus = ['ativo', 'inativo', 'cancelado', 'promo', 'suspenso'];
            const statusLower = data.status.toLowerCase();

            if (!validStatus.includes(statusLower)) {
                return serverError('Invalid status. Valid options: ' + validStatus.join(', '), 400);
            }

            // Normalize status to lowercase
            data.status = statusLower;
        }

        if (Object.keys(data).length === 0) {
            return serverError('No valid fields to update', 400);
        }

        // Corrige data de atualização se não veio
        if (data.updatedAt === undefined) data.updatedAt = Date.now();

        const result = await updateById('plano', id, data, 'id');

        if (!result) {
            return notFound('Plano not found');
        }

        return success({
            data: result,
            message: 'Plano Atualizado!'
        });

    } catch (error) {
        console.error('UPDATE Plan Error:', error);
        return serverError('Failed to update plan');
    }
}

module.exports = {
    getPlanos,
    getPlanoById,
    createPlano,
    updatePlano
};
