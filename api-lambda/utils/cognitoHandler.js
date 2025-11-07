// api-lambda/utils/cognitoHandler.js
import { createAssinante } from '../handlers/tenant/assinantes.js';

export const handlePostConfirmation = async (event) => {
    console.log('\u2699\uFE0F Cognito PostConfirmation Handler Started');

    try {
        const { sub, given_name, family_name, email } = event.request.userAttributes;

        // 1. Construct the full name from given_name and family_name
        const nome = `${given_name || ''} ${family_name || ''}`.trim();
        if (!nome) {
            console.error('\u274C Cannot create user: given_name or family_name is missing.');
            return event; // Exit if a name cannot be constructed
        }

        // 2. Mock a unique phone number using the cognito_sub
        // This creates a number like '+55119' + last 8 digits of the sub. Guaranteed to be unique.
        const foneMock = `+55119${sub.replace(/-/g, '').slice(-8)}`;

        // 3. Prepare a mock API Gateway event body for createAssinante
        const mockApiBody = {
            cognito_sub: sub,
            nome: nome,
            username: email.split('@')[0],
            email: email,
            fone: foneMock,
        };

        console.log('\uD83D\uDCDD Preparing to call createAssinante with mock body:', mockApiBody);

        // 4. Create a mock API Gateway event object
        const mockApiEvent = {
            httpMethod: 'POST',
            path: '/tenants/assinantes', // The path doesn't matter, but it's good practice to set it
            body: JSON.stringify(mockApiBody),
        };

        // 5. Call your existing, robust createAssinante function
        const result = await createAssinante(mockApiEvent);

        // Log the outcome from the createAssinante function
        console.log('\u2705 createAssinante finished with status:', result.statusCode);
        if (result.statusCode !== 201) {
            console.error('\u274C createAssinante returned an error:', result.body);
        }

    } catch (error) {
        console.error('\u274C Unhandled error in PostConfirmation handler:', error);
    }

    // Always return the original event to Cognito
    return event;
};
