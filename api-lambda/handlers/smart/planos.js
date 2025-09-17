const { getAll, getById, insert, updateById, getCount} = require('../../utils/database');
const { success, notFound, serverError } = require('../../utils/response');

// GET /api/v1/smart/plans
async function getPlanos(event) {
    try {
        console.log('GET Plans - Event:', JSON.stringify(event, null, 2));

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
            const validStatus = ['ativo', 'inativo', 'cancelado', 'promo'];
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

        const result = await getAll('plans', condition, params, parseInt(limit), parseInt(offset), orderClause);
        const totalCount = await getCount('plans', condition, params);

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
        console.log('GET Plan By ID - Event:', JSON.stringify(event, null, 2));

        const id = event.pathParameters?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        const result = await getById('plans', id);

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
        console.log('CREATE Plan - Event:', JSON.stringify(event, null, 2));

        const body = JSON.parse(event.body || '{}');

        // Validate required fields
        const requiredFields = ['nome', 'display_name', 'valor_atual'];
        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            return serverError(`Missing required fields: ${missingFields.join(', ')}`, 400);
        }

        // Prepare data (only allow specific fields)
        const allowedFields = ['nome', 'display_name', 'descricao', 'valor_atual', 'createdAt', 'updatedAt', 'status'];
        const data = {};

        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                data[field] = body[field];
            }
        });

        // Set defaults
        if (data.createdAt === undefined) data.createdAt = Date.now();
        if (data.status === undefined) data.status = 'ativo';

        const result = await insert('plans', data);

        return success({
            data: result,
            message: 'Novo plano criado!'
        }, 201);

    } catch (error) {
        console.error('CREATE Plan Error:', error);
        return serverError('Failed to create plan');
    }
}

// PUT /api/v1/smart/plans/{id}
async function updatePlano(event) {
    try {
        console.log('UPDATE Plan - Event:', JSON.stringify(event, null, 2));

        const id = event.pathParameters?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        const body = JSON.parse(event.body || '{}');

        // Prepare data (only allow specific fields)
        const allowedFields = ['nome', 'display_name', 'descricao', 'valor_atual', 'updatedAt', 'status'];
        const data = {};

        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                data[field] = body[field];
            }
        });

        if (Object.keys(data).length === 0) {
            return serverError('No valid fields to update', 400);
        }

        const result = await updateById('plans', id, data);

        if (!result) {
            return notFound('Plan not found');
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
