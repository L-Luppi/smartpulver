const { executeQuery, getCount} = require('../../utils/database');
const { success, serverError } = require('../../utils/response');

async function getProdutos(event) {
    try {
        const queryParams = event.queryStringParameters || {};
        const {
            limit = 50,
            offset = 0,
            orderBy = 'produto_nome',
            sortOrder = 'ASC',
            search,                    // search in product name
        } = queryParams;

        // Validate and sanitize parameters
        const pagination_min = 20;
        const pagination_max = 200;
        const validLimit = Math.min(Math.max(parseInt(limit) || 50, pagination_min), pagination_max);
        const validOffset = Math.max(parseInt(offset) || 0, 0);
        const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

        const mainQuery = `SELECT 
                            p.id                            as produto_id,
                            p.nome                          as produto_nome,
                            p.observacao                    as produto_obs,
                            'registrado'                    as registro_agrofit,
                            ap.numero_registro,
                            af.sigla                        as formulacao_sigla,
                            af.formulacao                   as formulacao,
                            ca.descricao                    as class_ambiental,
                            ct.descricao                    as class_toxicologica,
                            ap.produto_agricultura_organica as produto_organico,
                            ap.produto_biologico            as produto_biologico,
                            ap.inflamavel                   as produto_inflamavel,
                            ap.corrosivo                    as produto_corrosivo,
                            ap.url_bula                     as url_bula,
                            ap.url_agrofit                  as url_agrofit,
                            ap.status_prod                  as status_agrofit
                 FROM produto p
                          INNER JOIN produto_registrado pr ON p.id = pr.id_produto
                          INNER JOIN agrofit_produto ap ON pr.id_produto_agrofit = ap.numero_registro
                          LEFT JOIN agrofit_formulacao af ON af.id = ap.id_formulacao
                          LEFT JOIN agrofit_classe_ambiental ca ON ca.id = ap.id_classe_ambiental
                          LEFT JOIN agrofit_classe_toxicologica ct ON ct.id = ap.id_classe_toxicologica
                WHERE
                    ${search ? `LOWER(TRIM(p.nome)) LIKE LOWER('%${search.trim()}%')` : '1=1'}
                ORDER BY ${orderBy} ${validSortOrder}
                LIMIT ${validLimit} OFFSET ${validOffset};
            `;
        //const produtos = await executeQuery(mainQuery);
        const condition = search ? `LOWER(TRIM(p.nome)) LIKE LOWER('%${search}.trim()}%')` : '1=1';

        const [produtos, totalCount] = await Promise.all([
            executeQuery(mainQuery),
            getCount('produto', condition, [])
        ]);

        if (produtos.length === 0) {
            return success({
                data: produtos,
                pagination: {
                    total: 0
                }
            });
        }

        // collect unique agrofit numero_registro from result
        const productIds = produtos.map(ap => ap.numero_registro);

        const categoriesQuery = `
            SELECT
                ap.numero_registro,
                cat.descricao
            FROM agrofit_produto ap
                INNER JOIN agrofit_categ_prod cp ON ap.numero_registro = cp.numero_registro
                INNER JOIN agrofit_categoria cat ON cp.id_categoria = cat.id
            WHERE ap.numero_registro IN (?);
        `;

        const technologyQuery = ` 
            SELECT
                ap.numero_registro,
                ta.descricao
            FROM agrofit_produto ap
                INNER JOIN agrofit_tec_aplic_prod tap ON ap.numero_registro = tap.numero_registro
                INNER JOIN agrofit_tecnica_aplicacao ta ON tap.id = ta.id
            WHERE ap.numero_registro IN (?);
        `;

        // run complementary query in paralel
        const [categoriesRows, technologyRows] = await Promise.all([
            executeQuery(categoriesQuery, [productIds]),
            executeQuery(technologyQuery, [productIds]),
        ]);

        const produtosMap = new Map(produtos.map(ap => [ap.numero_registro, { ...ap, produto_categoria: [], tecnica_aplicacao: [] }]));

        for (const row of categoriesRows) {
            if (produtosMap.has(row.numero_registro)) {
                produtosMap.get(row.numero_registro).produto_categoria.push(row.descricao);
            }
        }

        for (const row of technologyRows) {
            if (produtosMap.has(row.numero_registro)) {
                produtosMap.get(row.numero_registro).tecnica_aplicacao.push(row.descricao);
            }
        }

        // converte map para array
        const listaProdutos = Array.from(produtosMap.values());

        return success({
            data: listaProdutos,
            pagination: {
                total: totalCount,
                count: produtos.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + produtos.length) < totalCount,
            },
            sorting: {
                orderBy: orderBy
            }
        });

    } catch (error) {
        console.error('GET Produtos Error:', error);
        return serverError('Failed to fetch produtos');
    }
}

module.exports = {
    getProdutos
};