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
            LEFT JOIN agrofit_titular_reg tt ON p.id_titular_registro = tt.id
            LEFT JOIN produto_registrado pr ON p.numero_registro = pr.id_produto_agrofit
            LEFT JOIN produto prod ON pr.id_produto = prod.id
            LEFT JOIN agrofit_tec_aplic_prod tap ON p.numero_registro = tap.numero_registro 
            LEFT JOIN agrofit_tecnica_aplicacao ta ON tap.id = ta.id
            LEFT JOIN agrofit_categ_prod cap ON p.numero_registro = cap.numero_registro
            LEFT JOIN agrofit_categoria cat ON cap.id_categoria = cat.id
            LEFT JOIN agrofit_acao_prod acprod ON p.numero_registro = acprod.numero_registro
            LEFT JOIN agrofit_acao ac ON acprod.id_acao = ac.id
        `;

        const joins = new Set(); // Use a Set to avoid duplicate joins
        const whereClauses = [];
        const params = [];

        // 1. Handle Search Query ('q')
        if (q) {
            whereClauses.push(`(p.marca_comercial LIKE ? OR prod.nome LIKE ?)`);
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
        const countQuery = `SELECT COUNT(DISTINCT p.numero_registro) as total ${baseQuery} ${joinClause} ${whereClause}`;
        const countResult = await executeQuery(countQuery, params);
        const totalCount = countResult[0].total;
        const limitInt = parseInt(limit);
        const offsetInt = parseInt(offset);

        // Query for the paginated data
        const dataQuery = `
            SELECT 
                p.numero_registro, p.marca_comercial,
                p.produto_agricultura_organica as isOrganico,
                p.produto_biologico as isBiologico,
                p.inflamavel, p.corrosivo, p.url_bula,
                p.url_agrofit, p.status_prod, 
                f.formulacao as formulacao,
                ca.descricao as classe_ambiental,
                ct.descricao as classe_toxicologica,
                tt.nome as titular_registro,
                GROUP_CONCAT(DISTINCT prod.nome SEPARATOR ' | ') AS nomes_comerciais,
                GROUP_CONCAT(DISTINCT ta.descricao SEPARATOR ' | ') AS tecnicas_aplic,
                GROUP_CONCAT(DISTINCT cat.descricao SEPARATOR ' | ') AS categoria, 
                GROUP_CONCAT(DISTINCT ac.descricao SEPARATOR ' | ') AS acao
                
            ${baseQuery} ${joinClause} ${whereClause}
            GROUP BY
                p.numero_registro
            ${orderClause}
            LIMIT ${limitInt} OFFSET ${offsetInt}
        `;

        //const finalParams = [...params, parseInt(limit), parseInt(offset)];
        //console.log('CALLING AGROFIT WITH ', dataQuery, '\nPARAMS ', finalParams);
        const result = await executeQuery(dataQuery, params);

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
                p.numero_registro, p.marca_comercial,
                p.produto_agricultura_organica as isOrganico,
                p.produto_biologico as isBiologico,
                p.inflamavel, p.corrosivo, p.url_bula,
                p.url_agrofit, p.status_prod,
                f.formulacao as formulacao,
                ca.descricao as classe_ambiental,
                ct.descricao as classe_toxicologica,
                tt.nome as titular_registro, 
                GROUP_CONCAT(DISTINCT prod.nome SEPARATOR ' | ') AS nomes_comerciais,
                GROUP_CONCAT(DISTINCT ta.descricao SEPARATOR ' | ') AS tecnicas_aplic,
                GROUP_CONCAT(DISTINCT cat.descricao SEPARATOR ' | ') AS categoria, 
                GROUP_CONCAT(DISTINCT ac.descricao SEPARATOR ' | ') AS acao
            FROM 
                agrofit_produto p
            LEFT JOIN agrofit_formulacao f ON p.id_formulacao = f.id
            LEFT JOIN agrofit_classe_ambiental ca ON p.id_classe_ambiental = ca.id
            LEFT JOIN agrofit_classe_toxicologica ct ON p.id_classe_toxicologica = ct.id
            LEFT JOIN agrofit_titular_reg tt ON p.id_titular_registro = tt.id
            LEFT JOIN produto_registrado pr ON p.numero_registro = pr.id_produto_agrofit
            LEFT JOIN produto prod ON pr.id_produto = prod.id
            LEFT JOIN agrofit_tec_aplic_prod tap ON p.numero_registro = tap.numero_registro 
            LEFT JOIN agrofit_tecnica_aplicacao ta ON tap.id = ta.id
            LEFT JOIN agrofit_categ_prod cap ON p.numero_registro = cap.numero_registro
            LEFT JOIN agrofit_categoria cat ON cap.id_categoria = cat.id
            LEFT JOIN agrofit_acao_prod acprod ON p.numero_registro = acprod.numero_registro
            LEFT JOIN agrofit_acao ac ON acprod.id_acao = ac.id

            WHERE p.numero_registro = ?
            
            GROUP BY
                p.numero_registro, p.marca_comercial, p.produto_agricultura_organica,
                p.produto_biologico, p.inflamavel, p.corrosivo, p.url_bula, p.url_agrofit,
                p.status_prod, formulacao, classe_ambiental, classe_toxicologica, titular_registro;
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

export async function searchProdutosByName(event) {
    try {
        const queryParams = event.queryStringParameters || {};
        const {
            q,
            limit = 15
        } = queryParams;

        if (!q || q.trim().length < 3) {
            return success([]);
        }

        const searchTerm = `%${q}%`;
        const limitInt = parseInt(limit);

        // This version removes the unnecessary GROUP BY clause, fixing the error.
        const query = `
            SELECT
                p.id,
                ap.numero_registro,
                p.nome as nome_comercial,
                ap.marca_comercial as nome_referencia,
                CASE
                    WHEN ap.numero_registro IS NULL THEN 'Produto Não Registrado'
                    WHEN p.nome = ap.marca_comercial THEN 'Marca Referência'
                    ELSE 'Nome Comercial'
                END as tipo_nome
            FROM
                produto p
            LEFT JOIN produto_registrado pr ON p.id = pr.id_produto
            LEFT JOIN agrofit_produto ap ON pr.id_produto_agrofit = ap.numero_registro
            WHERE
                p.nome LIKE ?
            ORDER BY
                FIELD(tipo_nome, 'Marca Referência', 'Nome Comercial', 'Produto Não Registrado'),
                nome_comercial
            LIMIT ${limitInt}
        `;

        const params = [searchTerm];

        const results = await executeQuery(query, params);

        return success(results);

    } catch (error) {
        console.error('Search Produtos Error:', error);
        return serverError('Failed to search products');
    }
}
