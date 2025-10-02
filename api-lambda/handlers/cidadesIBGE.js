const { getAll, executeQuery} = require('../utils/database');
const { success, notFound, serverError } = require('../utils/response');

/* exemplos de uso
# All states
GET /api/v1/estados

# All cities (paginated)
GET /api/v1/cidades?limit=50&offset=0

# Cities by state (query param)
GET /api/v1/cidades?sigla=SP&limit=10

# Cities by state (path param)
GET /api/v1/cidades/RJ?limit=20
 */


async function getUF() {
    try {
        const result = await getAll('ibge_uf','',[], null, 0,'sigla');

        return success({
            data:result,
            total: result.length
        });
    } catch (err) {
        return serverError('Failed to fetch states', err);
    }

}

async function getCidades(event) {
    try {

        const queryParams = event.queryStringParameters || {};
        const {
            limit = 100,           // Higher default for cities
            offset = 0,
            uf_id,                 // Filter by state ID
            sigla,                 // Alternative: filter by state code (SP, RJ, etc)
            orderBy = 'c.nome ASC' // Default: alphabetical by city name
        } = queryParams;

        const baseQuery = `
            SELECT 
                c.nome as cidade_nome,
                c.codigo as cidade_codigo_ibge,
                c.ddd, 
                c.latitude,
                c.longitude,
                u.codigo_uf,
                u.nome as uf_nome,
                u.sigla as uf_sigla,
                u.regiao
            FROM ibge_cidades c
            INNER JOIN ibge_uf u ON c.uf_id = u.codigo_uf
        `;

        const countQuery = `
            SELECT COUNT(*) as total
            FROM ibge_cidades c
            INNER JOIN ibge_uf u ON c.uf_id = u.codigo_uf
        `;

        let whereClause = '';
        const params = [];

        // Filter by state ID (numeric)
        if (uf_id) {
            whereClause = ' WHERE c.uf_id = ?';
            params.push(uf_id);
        }
        // Filter by state code (SP, RJ, MG, etc)
        else if (sigla) {
            whereClause = ' WHERE u.sigla = ?';
            params.push(sigla.toUpperCase());
        }

        // Build final queries
        const finalQuery = baseQuery + whereClause + ` ORDER BY ${orderBy} LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        const finalCountQuery = countQuery + whereClause;

        // Execute queries
        const [result, countResult] = await Promise.all([
            executeQuery(finalQuery, params),
            executeQuery(finalCountQuery, params)
        ]);

        const totalCount = countResult[0].total;

        return success({
            data: result,
            pagination: {
                total: totalCount,
                count: result.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + result.length) < totalCount
            },
            filter: uf_id ? { uf_id } : sigla ? { sigla: sigla.toUpperCase() } : null
        });

    } catch (error) {
        console.error('GET Cidades Error:', error);
        return serverError('Failed to fetch cities');
    }
}

async function getCidadesByUF(event) {
    try {
        console.log('event', event);
        const sigla = event.routeParams?.sigla;
        console.log('sigla', sigla);
        if (!sigla) {
            return serverError('Sigla UF parameter is required', 400);
        }

        if (!/^[A-Z]{2}$/i.test(sigla)) {
            return serverError('Invalid UF code format. Use 2 letters (e.g., SP, RJ)', 400);
        }

        const queryParams = event.queryStringParameters || {};
        const {
            limit = 100,
            offset = 0,
            orderBy = 'c.nome ASC'
        } = queryParams;

        const query = `
            SELECT 
                c.nome as cidade_nome,
                c.codigo as cidade_codigo_ibge,
                c.ddd,
                c.latitude,
                c.longitude,
                u.codigo_uf,
                u.nome as uf_nome,
                u.sigla as uf_sigla,
                u.regiao
            FROM ibge_cidades c
            INNER JOIN ibge_uf u ON c.uf_id = u.codigo_uf
            WHERE u.sigla = ?
            ORDER BY ${orderBy}
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
        `;

        const countQuery = `
            SELECT COUNT(*) as total
            FROM ibge_cidades c
            INNER JOIN ibge_uf u ON c.uf_id = u.codigo_uf
            WHERE u.sigla = ?
        `;

        const params = [sigla.toUpperCase()];

        const [result, countResult] = await Promise.all([
            executeQuery(query, params),
            executeQuery(countQuery, params)
        ]);

        const totalCount = countResult[0].total;

        if (result.length === 0) {
            return serverError('State not found or has no cities', 404);
        }

        return success({
            data: result,
            pagination: {
                total: totalCount,
                count: result.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + result.length) < totalCount
            },
            state: {
                codigo_uf: result[0].codigo_uf,
                nome: result[0].uf_nome,
                sigla: result[0].uf_sigla,
                regiao: result[0].regiao
            }
        });

    } catch (error) {
        console.error('GET Cidades By UF Error:', error);
        return serverError('Failed to fetch cities for state');
    }
}

async function getCidade(event) {
    try {
        const cod_ibge = event.routeParams?.cod_ibge
        if (!cod_ibge) {
            return serverError('Codigo IBGE parameter is required', 400);
        }

        const query = `
            SELECT 
                c.nome as cidade_nome,
                c.codigo as cidade_codigo_ibge,
                c.ddd,
                c.latitude,
                c.longitude,
                u.codigo_uf,
                u.nome as uf_nome,
                u.sigla as uf_sigla,
                u.regiao
            FROM ibge_cidades c
            INNER JOIN ibge_uf u ON c.uf_id = u.codigo_uf
            WHERE c.codigo = ?
        `;

        const result = await executeQuery(query,[cod_ibge])

        if (!result) {
            return notFound('Cidade not found');
        }

        return success({
            data: result
        });

    } catch (error) {
        return serverError('Failed to fetch city for state', error);
    }
}

module.exports = {
    getUF,
    getCidades,
    getCidadesByUF,
    getCidade
};
