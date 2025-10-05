const { getAll, getById, insert, updateById, getCount, executeQuery} = require('../../utils/database');
const { success, notFound, serverError } = require('../../utils/response');
const { getLocationData, extractCityCode} = require('../../utils/locationService');
const { validateRequiredFields, validateRestrictedFields, createErrorResponse, validateFieldValues, filterAllowedFields} = require('../../utils/dataValidation');

const REQUIRED_FIELDS = ['nome', 'username', 'email', 'fone', 'cognito_sub'];
const UNIQUE_FIELDS = ['email', 'cpf_cnpj', 'fone', 'cognito_sub'];
const ALLOWED_SORT_FIELDS = ['id', 'nome', 'username'];
const ALLOWED_UPDATE_FIELDS = ['nome','username', 'email', 'validade_plano', 'fone', 'cep',
    'id_cidade_ibge', 'endereco','numero','bairro','complemento','status'];
const VALID_STATUS = ['ativo', 'inativo', 'cancelado', 'suspenso', 'registrado'];

async function getAssinantes(event) {
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
        const enrichedResult = await getLocationData(result, 'id_cidade_ibge');

        return success(enrichedResult);

    } catch (error) {
        console.error('GET Assinante By ID Error:', error);
        return serverError('Failed to fetch assinante');
    }
}

async function createAssinante(event) {
    try {
        const body = JSON.parse(event.body || '{}');

        // Validate required fields
        const requiredValidation = validateRequiredFields(body, REQUIRED_FIELDS);

        if(!requiredValidation.isValid) {
            return createErrorResponse(400, 'MISSING FIELDS', 'Missing or empty required fields', requiredValidation);
        }

        // VALIDATE UNIQUE FIELDS
        for (const field of UNIQUE_FIELDS) {
            const query = `SELECT id FROM assinante WHERE ${field} = ?`;
            const [existing] = await executeQuery(query, [body[field]]);
            if (existing) {
                return createErrorResponse(409, 'CONFLICT', `Já existe um assinante com este '${field}' cadastrado`,
                    { field, value: body[field] });
            }
        }

        //filter to prevent undesired injections
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


async function updateAssinante(event) {
    try {
        const id = event.routeParams?.id;
        if (!id) {
            return serverError('id do assinante is required', 400);
        }
        const body = JSON.parse(event.body || '{}');

        // 1. CHECK IF RECORD EXISTS
        const existing = await getById('assinante', id, '', 'id');
        if (!existing) {
            return createErrorResponse(404, 'NOT_FOUND',
                'Assinante not found', { id: parseInt(id) });
        }

        const allowedFields = ['nome', 'username', 'email', 'validade_plano', 'fone', 'cpf_cnpj',
            'cep', 'id_cidade_ibge', 'endereco','numero','bairro','complemento','status', 'cognito_sub'];

        // VALIDA TENTATIVA DE ALTERAR COLUNAS RESTRITAS
        const restrictedFields = ['id', 'createdAt', 'updatedAt'];
        const restrictedValidation = validateRestrictedFields(body, restrictedFields);

        if(!restrictedValidation.isValid) {
            return createErrorResponse(400, 'FORBIDDEN_FIELDS',
                'Cannot update restricted fields', {
                    restricted_fields: restrictedValidation.restricted,
                    allowed_fields: allowedFields
                });
        }

        // VALIDATE DUPLICATES
        const duplicateChecks = [
            { field: 'email', value: body.email },
            { field: 'username', value: body.username },
            { field: 'fone', value: body.fone },
            { field: 'cpf_cnpj', value: body.cpf_cnpj }
        ].filter(check => check.value); // Only check fields that have values

        // Only validate duplicates if any of unique value fields are informed
        if (duplicateChecks.length > 0) {
            // BUILD QUERY TO CHECK ALL DUPLICATES
            const conditions = duplicateChecks.map((check) => `${check.field} = ?`).join(' OR ');
            const values = duplicateChecks.map((check) => check.value);
            values.push(id); //ADICIONA ID ATUAL PARA EXCLUIR DA VALIDAÇÃO

            const duplicatesQuery = `SELECT id, email, username, fone, cpf_cnpj
                                 FROM assinante 
                                 WHERE (${conditions}) AND id != ?`;

            console.log("QUERY =>", duplicatesQuery, values);
            const existingRecords = await executeQuery(duplicatesQuery, values);

            if (existingRecords && existingRecords.length > 0) {
                const foundDuplicates = [];
                duplicateChecks.forEach((check) => {
                    const duplicate = existingRecords.find(record =>
                        record[check.field] === check.value
                    );
                    if (duplicate) {
                        foundDuplicates.push({
                            field: check.field,
                            value: check.value,
                            existing_id: duplicate.id
                        });
                    }
                });

                if(foundDuplicates.length > 0) {
                    const fieldNames = foundDuplicates.map(d => d.field);
                    const message = foundDuplicates.length === 1 ?
                        `${fieldNames[0]} já cadastrado` :
                        `Campos já cadastrados: ${fieldNames.join(', ')}`;

                    return createErrorResponse(409, 'REGISTROS DUPLICADOS', message, {
                        duplicates: foundDuplicates,
                        total_duplicates: foundDuplicates.length
                    });
                }
            }
        }

        // VALIDATE AND EXTRACT CITY CODE
        let cityCode = null;
        if(body.id_cidade_ibge && !body.id_cidade_ibge.trim() === '') {
            cityCode = body.id_cidade_ibge
        } else {
            cityCode = extractCityCode(body.location);
        }

        if ( cityCode ) {
            const cityExists = await getById('ibge_cidades', cityCode, '', 'codigo')
            if (!cityExists || cityExists.length === 0) {
                return createErrorResponse(400, 'ERRO DE VALIDAÇÃO DA CIDADE',
                    'CODIGO DA CIDADE INVÁLIDO', {
                        field: 'location',
                        provided_code: cityCode
                    });
            }
            body.id_cidade_ibge = cityCode;
        }

        const data = {};
        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                data[field] = body[field];
            }
        });

        // Special validation for status field
        if (data.status !== undefined) {
            const validStatus = ['ativo', 'inativo', 'cancelado', 'suspenso'];
            const statusLower = data.status.toLowerCase();

            if (!validStatus.includes(statusLower)) {
                return serverError('Invalid status. Valid options: ' + validStatus.join(', '), 400);
            }

            // Normalize status to lowercase
            data.status = statusLower;
        }

        if (Object.keys(data).length === 0) {
            return serverError('Nothing to update', 400);
        }

        // Set defaults
        data.updatedAt = Date.now();

        const result = await updateById('assinante', id, data, 'id');

        if (!result) {
            return notFound('Assinante not found');
        }

        return success({
            data: result,
            message: 'Assinante Atualizado!'
        });

    } catch (error) {
        console.error('UPDATE Assinante Error:', error);
        return serverError('Failed to update assinante');
    }
}

module.exports = {
    getAssinantes,
    getAssinanteById,
    createAssinante,
    updateAssinante
};



/*
// VALIDATE AND EXTRACT CITY CODE
let cityCode = null;
if(body.id_cidade_ibge && !body.id_cidade_ibge.trim() === '') {
    cityCode = body.id_cidade_ibge
} else {
    cityCode = extractCityCode(body.location);
}

if ( cityCode ) {
    const cityExists = await getById('ibge_cidades', cityCode, '', 'codigo')
    if (!cityExists || cityExists.length === 0) {
        return createErrorResponse(400, 'ERRO DE VALIDAÇÃO DA CIDADE',
            'CODIGO DA CIDADE INVÁLIDO', {
                field: 'location',
                provided_code: cityCode
            });
    }
    body.id_cidade_ibge = cityCode;
}

// Prepare data (only allow specific fields)
const allowedFields = ['nome', 'username', 'email', 'validade_plano', 'fone', 'cpf_cnpj',
    'cep', 'id_cidade_ibge', 'endereco','numero','bairro','complemento','status', 'cognito_sub'];

const data = {};
allowedFields.forEach(field => {
    if (body[field] !== undefined) {
        data[field] = body[field];
    }
});
*/