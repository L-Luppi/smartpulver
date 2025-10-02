// Creates a universal local Express.js server that uses
// main Lambda router in `api-lambda/index.js`.
// It allows to test entire API locally with tools like Postman.

const express = require('express');
const cors = require('cors');
const { handler } = require('./index'); // Import the main handler
const { closePool } = require('./utils/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies for POST/PUT requests
app.use(express.json());
app.use(cors());


/**
 * A helper function to format the Lambda response into a standard
 * HTTP response that Express can send back to the client.
 */
const sendLambdaResponse = (res, lambdaResponse) => {
    // Set headers from the Lambda response, if any
    if (lambdaResponse.headers) {
        res.set(lambdaResponse.headers);
    }

    // If the body is a string (as it often is from Lambda), parse it.
    const body = typeof lambdaResponse.body === 'string'
        ? JSON.parse(lambdaResponse.body)
        : lambdaResponse.body;

    res.status(lambdaResponse.statusCode).json(body);
};

// Create a "catch-all" route that mimics AWS API Gateway's proxy integration
app.all(/.*/, async (req, res) => {
    //console.log(`[local-server] ${req.method} ${req.originalUrl}`);

    // 2. Construct the 'event' object that the Lambda handler expects
    const event = {
        httpMethod: req.method,
        path: req.originalUrl,
        queryStringParameters: req.query,
        body: req.body ? JSON.stringify(req.body) : null,
        headers: req.headers,
    };

    // 3. Call the main handler with the simulated event
    const result = await handler(event);

    // 4. Send the handler's response back to the client (e.g., Postman)
    sendLambdaResponse(res, result);
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Universal API server running.`);
    console.log(`✅ Listening for all API routes on http://localhost:${PORT}`);
});

// Gracefully close the database pool when the server shuts down (Ctrl+C)
process.on('SIGINT', async () => {
    console.log('\nSIGINT received. Closing server and database pool...');
    await closePool();
    server.close(() => {
        console.log('Server and database pool closed');
        process.exit(0);
    })
});