import {getAll, getById, insert, updateById, getCount, executeQuery} from '../../utils/database.js';
import {success, notFound, serverError } from '../../utils/response.js';
import {getLocationData, extractCityCode} from '../../utils/locationService.js';
import {validateRequiredFields, createErrorResponse, validateFieldValues, filterAllowedFields} from '../../utils/dataValidation.js';

const REQUIRED_FIELDS = ['nome', 'username', 'email', 'fone', 'cognito_sub'];
const UNIQUE_FIELDS = ['email', 'cpf_cnpj', 'fone', 'cognito_sub'];
const ALLOWED_SORT_FIELDS = ['id', 'nome', 'username'];
const ALLOWED_UPDATE_FIELDS = ['nome','username', 'email', 'validade_plano', 'fone', 'cep', 'cpf_cnpj',
    'id_cidade_ibge', 'endereco','numero','bairro','complemento','status','cognito_sub'];
const VALID_STATUS = ['ativo', 'inativo', 'cancelado', 'suspenso', 'registrado'];

export async function getAssinantes(event) {
    try {
        const queryParams = event.queryStringParameters || {};
        const {
            limit = 50,
            offset = 0,
            status,
            sortBy = 'nome',
            sortOrder = 'ASC'
        } = queryParams;

        let condition = '';
        const params = [];
        const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

        if (status !== undefined) {
            if (validateFieldValues(status.trim().toLowerCase(), VALID_STATUS)) {
                condition = 'status = ?';
                params.push(status.trim().toLowerCase());
            } else {
                return createErrorResponse(400, 'INVALID_PARAMETER', 'Invalid status.  Valid options: ' + VALID_STATUS.join(', '));
            }
        }

        let orderClause = 'nome ASC';
        if (validateFieldValues(sortBy.trim().toLowerCase(sortBy), ALLOWED_SORT_FIELDS)) {
            orderClause = `${sortBy} ${validSortOrder}`;
        }

        const [result, totalCount] = await Promise.all([
            getAll('assinante', condition, params, parseInt(limit), parseInt(offset), orderClause),
            getCount('assinante', condition, params)
        ]);

        const enrichedResult = await getLocationData(result, 'id_cidade_ibge');

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

export async function getAssinanteById(event) {
    try {
        const id = event.routeParams?.id;
        if (!id) {
            return serverError('ID parameter is required', 400);
        }

        const result = await getById('assinante', id, '', 'id');
        if (!result) {
            return notFound('Assinante');
        }
        const enrichedResult = await getLocationData(result, 'id_cidade_ibge');

        return success(enrichedResult);

    } catch (error) {
        console.error('GET Assinante By ID Error:', error);
        return serverError('Failed to fetch assinante');
    }
}

export async function createAssinante(event) {
    try {
        const body = JSON.parse(event.body || '{}');

        // Validate required fields
        const requiredValidation = validateRequiredFields(body, REQUIRED_FIELDS);

        if(!requiredValidation.isValid) {
            return createErrorResponse(400, 'MISSING FIELDS', 'Missing or empty required fields', requiredValidation);
        }

        // VALIDATE UNIQUE FIELDS
        for (const field of UNIQUE_FIELDS) {
            if (body[field]) {
                const query = `SELECT id FROM assinante WHERE ${field} = ?`;
                const [existing] = await executeQuery(query, [body[field]]);
                if (existing) {
                    return createErrorResponse(409, 'CONFLICT', `Já existe um assinante com este '${field}' cadastrado`,
                        { field, value: body[field] });
                }
            }
        }

        //filter to prevent undesired injection
        const data = filterAllowedFields(body, ALLOWED_UPDATE_FIELDS);
        const enrichedData = {...data,
            status: 'registrado',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        const result = await insert('assinante', enrichedData);

        return success({
            data: result,
            message: 'Novo assinante criado!'
        }, 201);

    } catch (error) {
        console.error('CREATE Assinante Error:', error);
        return serverError('Failed to create assinante');
    }
}

export async function updateAssinante(event) {
    try {
        const id = event.routeParams?.id;
        if (!id) {
            return serverError('id do assinante is required', 400);
        }

        const currentSubscriber = await getById('assinante', id, '', 'id');
        if (!currentSubscriber) {
            return createErrorResponse(404, 'NOT_FOUND',
                'Assinante not found', { id: parseInt(id) });
        }

        const body = JSON.parse(event.body || '{}');
        const cleanData = filterAllowedFields(body, ALLOWED_UPDATE_FIELDS);

        if (Object.keys(cleanData).length === 0) {
            return createErrorResponse(400, 'BAD_REQUEST', 'No valid fields to update');
        }

        for (const field of UNIQUE_FIELDS) {
            if (cleanData[field]) {
                const query = `SELECT id FROM assinante WHERE ${field} = ? AND id <> ?`;
                const [existing] = await executeQuery(query, [cleanData[field], id]);
                if (existing) {
                    return createErrorResponse(409, 'CONFLICT', `Já existe um assinante com este '${field}' cadastrado`, {
                        field,
                        value: cleanData[field]
                    });
                }
            }
        }

        if (cleanData.status !== undefined) {
            cleanData.status = cleanData.status.trim().toLowerCase();
            if (!validateFieldValues(cleanData.status, VALID_STATUS)) {
                return serverError('Invalid status.  Valid options: ' + VALID_STATUS.join(', '), 400);
            }
        }

        // VALIDATE AND EXTRACT CITY CODE if the field is present in the request
        if (Object.hasOwn(cleanData, 'id_cidade_ibge')) {
            const cityCode = extractCityCode(cleanData.id_cidade_ibge);

            // A non-null value was provided for the city, but it couldn't be parsed.
            if (!cityCode && cleanData.id_cidade_ibge !== null && cleanData.id_cidade_ibge !== '') {
                 return createErrorResponse(400, 'VALIDATION_ERROR',
                    'Formato de `id_cidade_ibge` inválido. Forneça um código de cidade ou um objeto de localização válido.', {
                        field: 'id_cidade_ibge',
                        provided_value: cleanData.id_cidade_ibge
                    });
            }

            if (cityCode) {
                // If a code was extracted, validate it against the database
                const cityExists = await getById('ibge_cidades', cityCode, '', 'codigo');
                if (!cityExists) {
                    return createErrorResponse(400, 'VALIDATION_ERROR',
                        'Código de cidade inválido.', {
                            field: 'id_cidade_ibge',
                            provided_code: cityCode
                        });
                }
                // Ensure the final, validated code from the database is what's stored
                cleanData.id_cidade_ibge = cityExists.codigo;
            } else {
                // If the provided value was null or empty, set it to null in the DB
                cleanData.id_cidade_ibge = null;
            }
        }

        const enrichedData = {...cleanData, updatedAt: Date.now()}
        const updatedAssinante = await updateById('assinante', id, enrichedData, 'id');

        return success({
            data: updatedAssinante,
            message: 'Assinante Atualizado!'
        });

    } catch (error) {
        console.error('UPDATE Assinante Error:', error);
        return serverError('Failed to update assinante');
    }
}
