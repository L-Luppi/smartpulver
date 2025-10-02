const { getAll, getById, insert, updateById, getCount, executeQuery } = require('../../utils/database');
const { success, notFound, serverError } = require('../../utils/response');

async function getAssinaturas(event) {
    try {
        const queryParams = event.queryStringParameters || {};
        const { limit = 50, offset = 0, id_assinante, id_plano, status } = queryParams;

        // Build condition for simple filtering on assinaturas table
        let condition = '';
        const params = [];
        const conditions = [];

        if (id_assinante) {
            conditions.push('id_assinante = ?');
            params.push(id_assinante);
        }

        if (id_plano) {
            conditions.push('id_plano = ?');
            params.push(id_plano);
        }

        if (status) {
            conditions.push('status = ?');
            params.push(status);
        }

        if (conditions.length > 0) {
            condition = conditions.join(' AND ');
        }

        // Get basic subscription data using standard getAll
        const result = await getAll('assinatura', condition, params, parseInt(limit), parseInt(offset), 'dt_assinatura DESC');
        const totalCount = await getCount('assinatura', condition, params);

        return success({
            data: result,
            pagination: {
                total: totalCount,
                count: result.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + result.length) < totalCount
            }
        });

    } catch (error) {
        console.error('GET Subscriptions Error:', error);
        return serverError('Failed to fetch subscriptions');
    }
}

// GET /api/v1/smart/subscriptions/{id} - Enhanced with JOIN data
async function getAssinaturaById(event) {
    try {
        const id = event.pathParameters?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        // Use custom query for detailed view with JOINs
        const query = `
            SELECT 
                a.*,
                p.nome as plano_plano,
                p.display_name as plano_display,
                p.descricao as plano_descricao,
                p.duracao_dias as plano_duracao,
                p.valor_atual as plano_valor,
                p.createdAt as plano_criado_em,
                p.updatedAt as plano_atualizado_em,
                p.status as plano_status,
                s.nome as assinante_nome,
                s.username as assinante_username,
                s.email as assinante_email,
                s.fone as assinante_fone,
                s.cpf_cnpj as assinante_cpf_cnpj,
                s.status as assinante_status, 
                s.cognito_sub as assinante_cognito_sub
            FROM assinatura a
            LEFT JOIN plano p ON a.id_plano = p.id
            LEFT JOIN assinante s ON a.id_assinante = s.id
            WHERE a.id = ?
        `;

        const result = await executeQuery(query, [id]);

        if (result.length === 0) {
            return notFound('Assinatura not found');
        }

        return success({ data: result[0] });

    } catch (error) {
        console.error('GET Subscription By ID Error:', error);
        return serverError('Failed to fetch subscription');
    }
}

async function createAssinatura(event) {

    let diasPlano = 1
    let valorPlano = 0.00

    try {
        const body = JSON.parse(event.body || '{}');

        // Validate required fields
        const requiredFields = ['id_assinante', 'id_plano'];
        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            return serverError(`Missing required fields: ${missingFields.join(', ')}`, 400);
        }

        // Verify that assinante and plan exist
        const assinante = await getById('assinante', body.id_assinante);
        if (!assinante) {
            return serverError('Assinante not found', 404);
        }

        const plano = await getById('plano', body.id_plano);
        if (!plano) {
            return serverError('Plano not found', 404);
        } else {
            diasPlano = parseInt(plano.body.data.duracao_dias);
            valorPlano = parseFloat(plano.body.data.valor_atual);
        }

        // Prepare data
        const allowedFields = ['id_plano', 'id_assinante', 'dt_assinatura', 'dt_vigencia', 'renova_automatico', 'valor_pago','status'];
        const data = {};

        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                data[field] = body[field];
            }
        });

        // Set defaults
        if (!data.status) data.status = 'ativo';
        if (!data.dt_assinatura) data.dt_assinatura = new Date().toISOString();

        // Calculate end date based on plan duration
        if (!data.dt_vigencia) {
            const vigencia = new Date(data.dt_assinatura); // evita que vigência fique diferente da assinatura

            if ( diasPlano < 30 ) {
                vigencia.setDate(vigencia.getDate()+diasPlano);

            } else if ( diasPlano >= 30 && diasPlano <= 360) {
                const diasExtras = diasPlano % 30;
                const mesesVigencia = Math.floor(diasPlano/30)
                vigencia.setMonth(vigencia.getMonth() + mesesVigencia);
                if ( diasExtras > 0 ) vigencia.setDate(vigencia.getDate()+diasExtras);
            } else {
                vigencia.setFullYear(vigencia.getFullYear() + 1);
            }
            data.dt_vigencia = vigencia;
        }

        // Set valor_pago from plan if not provided
        if (!data.valor_pago) {
            data.valor_pago = valorPlano;
        }

        const result = await insert('assinaturas', data);

        return success({
            data: result,
            message: 'Nova Assinatura Adicionada!'
        }, 201);

    } catch (error) {
        console.error('CREATE Subscription Error:', error);
        return serverError('Failed to create subscription');
    }
}

// PUT /api/v1/smart/subscriptions/{id}
async function updateAssinatura(event) {
    try {
        console.log('UPDATE Subscription - Event:', JSON.stringify(event, null, 2));

        const id = event.pathParameters?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        const body = JSON.parse(event.body || '{}');

        // Prepare data
        const allowedFields = ['id_plano', 'id_assinante', 'dt_assinatura', 'dt_vigencia', 'renova_automatico', 'valor_pago','status'];
        const data = {};

        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                data[field] = body[field];
            }
        });

        if (Object.keys(data).length === 0) {
            return serverError('No valid fields to update', 400);
        }

        const result = await updateById('assinatura', id, data);

        if (!result) {
            return notFound('Assinatura not found');
        }

        return success({
            data: result,
            message: 'Assinatura updated successfully'
        });

    } catch (error) {
        console.error('UPDATE Subscription Error:', error);
        return serverError('Failed to update subscription');
    }
}

module.exports = {
    getAssinaturas,
    getAssinaturaById,
    createAssinatura,
    updateAssinatura
};
