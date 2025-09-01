// amplify/data/resource.ts
import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
    // Enhanced User Profile with roles and permissions
    UserProfile: a
        .model({
            email: a.email().required(),
            name: a.string().required(),
            role: a.enum(['admin', 'manager', 'user', 'viewer']),
            department: a.string(),
            isActive: a.boolean().default(true),
            lastLogin: a.datetime(),
            preferences: a.json(),
            createdAt: a.datetime(),
            updatedAt: a.datetime(),
        })
        .authorization((allow) => [
            allow.owner(),
            allow.group('admin').to(['read', 'create', 'update', 'delete']),
            allow.group('manager').to(['read', 'update']),
        ]),

    // Keep the simple Todo for testing
    Todo: a
        .model({
            content: a.string(),
            completed: a.boolean().default(false),
            priority: a.enum(['low', 'medium', 'high']),
        })
        .authorization((allow) => [
            allow.owner(),
            allow.group('admin').to(['read', 'create', 'update', 'delete']),
        ]),
});

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool',
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});
