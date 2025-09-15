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

// Route configuration - maps routes to handler functions
// AJUSTAR RESOURCE {id} no API Gateway para poder fazer GET e POST por {id}
const routes = {
    // Planos e Assinaturas
    'GET /api/v1/smart/assinaturas': assinaturasHandler.getPlanos,
    'GET /api/v1/smart/assinaturas/{id}': assinaturasHandler.getPlanoById,
    'POST /api/v1/smart/assinaturas': assinaturasHandler.createPlano,
    'PUT /api/v1/smart/assinaturas/{id}': assinaturasHandler.updatePlano,

    // Assinantes endpoints
    'GET /api/v1/tenants/assinantes': assinantesHandler.getAssinantes,
    'GET /api/v1/tenants/assinantes/{id}': assinantesHandler.getAssinanteById,
    'POST /api/v1/tenants/assinantes': assinantesHandler.createAssinante,
    'PUT /api/vi/tenants/assinantes/{id}': assinantesHandler.updateAssinante,

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
 * @param {string} requestPath - The actual request path
 * @param {string} routePattern - The route pattern with {param} placeholders
 * @returns {Object} Match result with path parameters
 */
function matchRoute(requestPath, routePattern) {
    // Convert route pattern to regex (e.g., /api/v1/produtos/{id} -> /api/v1/produtos/([^/]+))

    const regexPattern = routePattern.replace(/\{[^}]+\}/g, '([^/]+)');
    const regex = new RegExp(`^${regexPattern}$`);
    const match = requestPath.match(regex);

    if (match) {
        // Extract path parameters
        const paramNames = (routePattern.match(/\{([^}]+)\}/g) || []).map(p => p.slice(1, -1));
        const pathParameters = {};
        paramNames.forEach((name, index) => {
            pathParameters[name] = match[index + 1];
        });
        return { match: true, pathParameters };
    }

    return { match: false };
}

/**
 * Main Lambda handler
 * @param {Object} event - Lambda event object
 * @param {Object} context - Lambda context object
 * @returns {Promise<Object>} HTTP response object
 */
exports.handler = async (event, context) => {
    console.log('=== Lambda Invocation ===');
    console.log('Method:', event.httpMethod);
    console.log('Path:', event.path);
    console.log('Query Parameters:', event.queryStringParameters);

    try {
        const method = event.httpMethod;
        const path = event.path;
        const routeKey = `${method} ${path}`;

        // Handle CORS preflight requests
        if (method === 'OPTIONS') {
            console.log('Handling CORS preflight request');
            return corsResponse();
        }

        // Try exact route match first
        let handler = routes[routeKey];
        let pathParameters = {};

        // If no exact match, try pattern matching for dynamic routes
        if (!handler) {
            console.log('No exact route match, trying pattern matching...');

            for (const [pattern, patternHandler] of Object.entries(routes)) {
                const [patternMethod, patternPath] = pattern.split(' ');

                if (patternMethod === method) {
                    const routeMatch = matchRoute(path, patternPath);
                    if (routeMatch.match) {
                        console.log('Pattern match found:', pattern);
                        handler = patternHandler;
                        pathParameters = routeMatch.pathParameters;
                        break;
                    }
                }
            }
        } else {
            console.log('Exact route match found:', routeKey);
        }

        // Execute handler if found
        if (handler) {
            // Add path parameters to event
            event.pathParameters = { ...event.pathParameters, ...pathParameters };

            console.log('Executing handler with path parameters:', pathParameters);
            const result = await handler(event, context);

            console.log('Handler executed successfully, status:', result.statusCode);
            return result;
        }

        // Route not found
        console.log('Route not found:', routeKey);
        console.log('Available routes:', Object.keys(routes));

        return {
            statusCode: 404,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: 'Route not found',
                route: routeKey,
                availableRoutes: Object.keys(routes),
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('=== Lambda Error ===');
        console.error('Error:', error);
        console.error('Stack:', error.stack);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: 'Internal server error',
                message: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};