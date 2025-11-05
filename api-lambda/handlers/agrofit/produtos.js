import { executeQuery } from '../../utils/database.js';
import { success, serverError, createErrorResponse, notFound } from '../../utils/response.js';

// Define constants for validation to keep the function clean and maintainable
const ALLOWED_SORT_FIELDS = ['id', 'marca_comercial', 'titular_registro', 'createdAt', 'updatedAt'];
const ALLOWED_FILTER_FIELDS = {
    id_formulacao: 'p.id_formulacao',
    id_classe_ambiental: 'p.id_classe_ambiental',
    id_classe_toxicologica: 'p.id_classe_toxicologica',
    id_tecnica_aplicacao: 'tap.id_tecnica_aplicacao'
};

export async function getProdutos(event) {
    try {
        const queryParams = event.queryStringParameters || {};
        const {
            limit = 50,
            offset = 0,
            q, // Search query for product names
            sortBy = 'marca_comercial',
            sortOrder = 'ASC'
        } = queryParams;

        // --- Build the Query ---
        let baseQuery = `
            FROM 
                agrofit_produto p
            LEFT JOIN agrofit_formulacao f ON p.id_formulacao = f.id
            LEFT JOIN agrofit_classe_ambiental ca ON p.id_classe_ambiental = ca.id
            LEFT JOIN agrofit_classe_toxicologica ct ON p.id_classe_toxicologica = ct.id
            LEFT JOIN produto prod ON p.numero_registro = prod.id
        `;

        const joins = new Set(); // Use a Set to avoid duplicate joins
        const whereClauses = [];
        const params = [];

        // 1. Handle Search Query ('q')
        if (q) {
            whereClauses.push(`(p.marca_comercial LIKE ? OR pn.nome LIKE ?)`);
            params.push(`%${q}%`, `%${q}%`);
        }

        // 2. Handle ID-based Filters
        for (const field in ALLOWED_FILTER_FIELDS) {
            if (queryParams[field]) {
                const dbColumn = ALLOWED_FILTER_FIELDS[field];

                // Add the join for tecnica_aplicacao only if it's needed
                if (field === 'id_tecnica_aplicacao') {
                    joins.add('LEFT JOIN agrofit_tec_aplic_prod tap ON p.id = tap.id_produto');
                }

                whereClauses.push(`${dbColumn} = ?`);
                params.push(queryParams[field]);
            }
        }

        // 3. Construct the final WHERE clause
        const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const joinClause = Array.from(joins).join(' ');

        // 4. Construct Sorting
        const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
        const validSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? `p.${sortBy}` : 'p.marca_comercial';
        const orderClause = `ORDER BY ${validSortBy} ${validSortOrder}`;

        // --- Execute Queries ---

        // Query for the total count for pagination
        const countQuery = `SELECT COUNT(DISTINCT p.id) as total ${baseQuery} ${joinClause} ${whereClause}`;
        const countResult = await executeQuery(countQuery, params);
        const totalCount = countResult[0].total;

        // Query for the paginated data
        const dataQuery = `
            SELECT 
                p.id, p.marca_comercial, p.titular_registro, p.numero_registro,
                f.nome as formulacao,
                ca.nome as classe_ambiental,
                ct.nome as classe_toxicologica,
                pn.nome as produto_normalizado_nome
            ${baseQuery} ${joinClause} ${whereClause}
            GROUP BY p.id
            ${orderClause}
            LIMIT ? OFFSET ?
        `;

        const finalParams = [...params, parseInt(limit), parseInt(offset)];
        const result = await executeQuery(dataQuery, finalParams);

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
                orderBy: validSortBy,
                sortOrder: validSortOrder
            }
        });

    } catch (error) {
        console.error('GET Agrofit Produtos Error:', error);
        return serverError('Failed to fetch agrofit products');
    }
}

// Keep getProdutoById as it is, it's efficient for fetching a single product.
// This function will fetch products from table produtos (byId)
// There will also be a getProductByRegistro wich will get from agrofit
export async function getProdutoById(event) {
    try {
        const id = event.routeParams?.id;
        if (!id) {
            return createErrorResponse(400, 'BAD_REQUEST', 'Product ID is required.');
        }

        const query = `
            SELECT 
                p.*,
                f.formulacao as formulacao,
                ca.descricao as classe_ambiental,
                ct.descricao as classe_toxicologica,
                prod.nome as nome_produto
            FROM 
                agrofit_produto p
            LEFT JOIN agrofit_formulacao f ON p.id_formulacao = f.id
            LEFT JOIN agrofit_classe_ambiental ca ON p.id_classe_ambiental = ca.id
            LEFT JOIN agrofit_classe_toxicologica ct ON p.id_classe_toxicologica = ct.id
            LEFT JOIN produto_registrado pr ON p.numero_registro = pr.id_produto_agrofit
            LEFT JOIN produto prod ON pr.id_produto = prod.id
            WHERE p.numero_registro = ?
        `;
        const [product] = await executeQuery(query, [id]);

        if (!product) {
            return notFound('Agrofit Product');
        }

        // You could add subsequent queries here to fetch related "many-to-many" data
        // like tecnicas_aplicacao, culturas, pragas etc. and append them to the response.

        return success({ data: product });

    } catch (error) {
        console.error('GET Agrofit Produto By ID Error:', error);
        return serverError('Failed to fetch agrofit product');
    }
}