import {config} from 'dotenv';
import path from 'path';
const __dirname = import.meta.dirname;
config({path: path.resolve(__dirname, '.env')});

import express from "express";
import cors from "cors";
import {handler} from "./index.js"; // Import the main handler
import {closePool} from "./utils/database.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

/**
 * A helper function to format the Lambda response into a standard
 * HTTP response that Express can send back to the client.
 */
const sendLambdaResponse = (res, lambdaResponse) => {
    if (lambdaResponse.headers) {
        res.set(lambdaResponse.headers);
    }
    const body = typeof lambdaResponse.body === 'string'
        ? JSON.parse(lambdaResponse.body)
        : lambdaResponse.body;
    res.status(lambdaResponse.statusCode).json(body);
};

// 1. Define the specific webhook route BEFORE the general JSON parser.
// Use a regular expression to match any potential stage prefix (like /prod) and use express.raw().
app.post(/.*\/api\/v1\/stripe\/webhook/, express.raw({type: 'application/json'}), async (req, res) => {
    const event = {
        httpMethod: req.method,
        path: req.originalUrl,
        headers: req.headers,
        body: req.body.toString(), // Pass the raw body as a string
    };
    const result = await handler(event);
    sendLambdaResponse(res, result);
});

// 2. For all other routes, use the standard express.json() middleware.
app.use(express.json());

// 3. Create a "catch-all" for all other routes.
app.all(/.*/, async (req, res) => {
    const event = {
        httpMethod: req.method,
        path: req.originalUrl,
        queryStringParameters: req.query,
        body: req.body ? JSON.stringify(req.body) : null,
        headers: req.headers,
    };
    const result = await handler(event);
    sendLambdaResponse(res, result);
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Universal API server running.`);
    console.log(`✅ Listening for all API routes on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
    console.log('\nSIGINT received. Closing server and database pool...');
    await closePool();
    server.close(() => {
        console.log('Server and database pool closed');
        process.exit(0);
    })
});
