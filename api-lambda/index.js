const { corsResponse, serverError, notFound } = require('./utils/response');

// Import all handler modules
const manufacturersHandler = require('./handlers/manufacturers');
const dronesHandler = require('./handlers/drones');
const miscHandler = require('./handlers/misc');
const produtosHandler = require('./handlers/agrofit/produtos');
const culturasHandler = require('./handlers/agrofit/culturas');
const pragasHandler = require('./handlers/agrofit/pragas');

//handlers para funções restritas por cliente (tenantID)
const assinantesHandler = require('./handlers/tenant/assinantes');

//handlers para funções administrativas
const assinaturasHandler = require('./handlers/smart/assinaturas');
const planosHandler = require('./handlers/smart/planos');
const IBGEHandler = require('./handlers/cidadesIBGE')

const routes = {
    // Gerais
    'GET estados': IBGEHandler.getUF,
    'GET cidades': IBGEHandler.getCidades,
    'GET cidades/{sigla}': IBGEHandler.getCidadesByUF,
    'GET cidade/{cod_ibge}': IBGEHandler.getCidade,

    // Planos e Assinaturas
    'GET smart/planos': planosHandler.getPlanos,
    'GET smart/planos/{id}': planosHandler.getPlanoById,
    'POST smart/planos': planosHandler.createPlano,
    'PUT smart/planos/{id}': planosHandler.updatePlano,

    'GET smart/assinaturas': assinaturasHandler.getAssinaturas,
    'GET smart/assinaturas/{id}': assinaturasHandler.getAssinaturaById,
    'POST smart/assinaturas': assinaturasHandler.createAssinatura,
    'PUT smart/assinaturas/{id}': assinaturasHandler.updateAssinatura,

    // Assinantes endpoints
    'GET tenants/assinantes': assinantesHandler.getAssinantes,
    'GET tenants/assinantes/{id}': assinantesHandler.getAssinanteById,
    'POST tenants/assinantes': assinantesHandler.createAssinante,
    'PUT tenants/assinantes/{id}': assinantesHandler.updateAssinante,

    // Manufacturers endpoints
    'GET /api/v1/manufacturers': manufacturersHandler.getManufacturers,
    'GET /api/v1/manufacturers/{id}': manufacturersHandler.getManufacturerById,

    // Drones endpoints
    'GET /api/v1/drones': dronesHandler.getDrones,
    'GET /api/v1/drones/{id}': dronesHandler.getDroneById,

    // Misc content endpoints
    'GET /api/v1/misc': miscHandler.getMiscContent,
    'GET /api/v1/misc/{id}': miscHandler.getMiscContentById,

    // Agrofit produtos endpoints
    'GET /api/v1/agrofit/produtos': produtosHandler.getProdutos,
    'GET /api/v1/agrofit/produtos/{id}': produtosHandler.getProdutoById,

    // Agrofit culturas endpoints
    'GET /api/v1/agrofit/culturas': culturasHandler.getCulturas,
    'GET /api/v1/agrofit/culturas/{id}': culturasHandler.getCulturaById,

    // Agrofit pragas endpoints
    'GET /api/v1/agrofit/pragas': pragasHandler.getPragas,
    'GET /api/v1/agrofit/pragas/{id}': pragasHandler.getPragaById
};

/**
 * Match dynamic routes with path parameters
 * @param {string} method - The actual request method
 * @param {string} proxy - The route parth
 * @returns {Object} Match result with path parameters
 */
function matchRoute(method, proxy) {
    // remove 'api/v1' prefix from proxy for route matching
    const cleanPath = proxy.replace(/^api\/v1\//, '');

    // Try exact match first
    const exactKey = `${method} ${cleanPath}`;
    if (routes[exactKey]) {
        return { handler: routes[exactKey], params: {} };
    }

    // Try pattern matching for routes with {id}, {sigla}, etc
    for (const [routeKey, handler] of Object.entries(routes)) {
        const [routeMethod, routePath] = routeKey.split(' ', 2);
        if (routeMethod !== method) continue;

        //Convert route pattern to regex
        const routeRegex = routePath.replace(/\{([^}]+)}/g, '([^/]+)');
        const regex = new RegExp(`^${routeRegex}$`);

        const match = cleanPath.match(regex);
        if (match) {
            // Extract parameter names and values
            const paramNames = [...routePath.matchAll(/\{([^}]+)}/g)].map(m => m[1]);
            const params = {};
            paramNames.forEach((name, index) => {
                params[name] = match[index + 1];
            });

            return { handler, params };
        }
    }

    return { match: false };
}

/**
 * Main Lambda handler
 * @param {Object} event - Lambda event object
 * @returns {Promise<Object>} HTTP response object
 */
exports.handler = async (event) => {
    const proxy = event.pathParameters?.proxy || '';
    const method = event.httpMethod;

    console.log(`${method} /${proxy}`);
    console.log('Full proxy:', JSON.stringify(proxy));

    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
        return corsResponse();
    }

    try {
        const route = matchRoute(method, proxy);

        if (route) {
          // Add matched parameters to event for handler use
          event.routeParams = route.params;

          // Call the matched handler
            return await route.handler(event)
        }

        //console.log('No route found - available routes:');
        //console.log(Object.keys(routes));

        return notFound('Route')

    } catch (error) {
        console.error('Handler error:', error);
        return serverError('Internal server error')
    }
};