const { corsResponse } = require('./utils/response');

// Handlers para tabelas abertas (publicas)
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

// Route configuration - maps routes to handler functions
// AJUSTAR RESOURCE {id} no API Gateway para poder fazer GET e POST por {id}
const routes = {
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
    'GET manufacturers': manufacturersHandler.getManufacturers,
    'GET manufacturers/{id}': manufacturersHandler.getManufacturerById,

    // Drones endpoints
    'GET drones': dronesHandler.getDrones,
    'GET drones/{id}': dronesHandler.getDroneById,

    // Misc content endpoints
    'GET misc': miscHandler.getMiscContent,
    'GET misc/{id}': miscHandler.getMiscContentById,

    // Agrofit produtos endpoints
    'GET agrofit/produtos': produtosHandler.getProdutos,
    'GET agrofit/produtos/{id}': produtosHandler.getProdutoById,

    // Agrofit culturas endpoints
    'GET agrofit/culturas': culturasHandler.getCulturas,
    'GET agrofit/culturas/{id}': culturasHandler.getCulturaById,

    // Agrofit pragas endpoints
    'GET agrofit/pragas': pragasHandler.getPragas,
    'GET agrofit/pragas/{id}': pragasHandler.getPragaById
};

/**
 * Match dynamic routes with path parameters
 * @param {string} requestPath - The actual request path
 * @param {string} routePattern - The route pattern with {param} placeholders
 * @returns {Object} Match result with path parameters
 */
function matchRoute(requestPath, routePattern) {
    // Convert route pattern to regex (e.g., /api/v1/produtos/{id} -> /api/v1/produtos/([^/]+))

    const regexPattern = routePattern.replace(/{[^}]+}/g, '([^/]+)');
    const regex = new RegExp(`^${regexPattern}$`);
    const match = requestPath.match(regex);

    if (match) {
        const pathParameters = {};
        (routePattern.match(/{([^}]+)}/g) || [])
            .map(p => p.slice(1, -1))
            .forEach((name, index) => {
                pathParameters[name] = match[index + 1];
            });
        return { pathParameters };
    }
    return null;
}

/**
 * Main Lambda handler
 * @param {Object} event - Lambda event object
 * @param {Object} context - Lambda context object
 * @returns {Promise<Object>} HTTP response object
 */
exports.handler = async (event, context) => {
    try {
        const method = event.httpMethod;
        const path = event.path;

        const cleanPath = path.replace(/^\/api\/v1\//, '');
        const routeKey = `${method} ${cleanPath}`;

        // Handle CORS preflight requests
        if (method === 'OPTIONS') {
            return corsResponse();
        }

        // Try exact route match first
        let handler = routes[routeKey];
        let pathParameters = {};

        // If no exact match, try pattern matching for dynamic routes
        if (!handler) {
            for (const [pattern, patternHandler] of Object.entries(routes)) {
                const [routeMethod, routePath] = pattern.split(' ',2);
                if (routeMethod === method) {
                    const matchResult = matchRoute(cleanPath, routePath);
                    if (matchResult) {
                        handler = patternHandler;
                        pathParameters = matchResult;
                        break;
                    }
                }
            }
        } else {
            console.log('Exact route match found:', routeKey);
        }

        if (handler) {
            // Add path parameters to event
            event.pathParameters = { ...event.pathParameters, ...pathParameters };
            return await handler(event, context);
        }

        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            },
            body: JSON.stringify({
                success: false,
                message: `Route not found: ${method} ${path}`,
            })
        };

    } catch (error) {
        console.error('Handler error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            },
            body: JSON.stringify({
                success: false,
                message: 'Internal server error'
            })
        };
    }
};