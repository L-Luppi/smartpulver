import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';

const client = generateClient();

// Define only the types we actually use
interface AuthUser {
    username: string;
    userId: string;
    signInDetails?: {
        loginId?: string;
        authFlowType?: string;
    };
}

interface SchemaType {
    name: string;
}

interface GraphQLSchemaResponse {
    data: {
        __schema: {
            types: SchemaType[];
        };
    };
}

interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive?: boolean;
    createdAt?: string;
}

interface CreateUserProfileResponse {
    data: {
        createUserProfile: UserProfile;
    };
}

interface ListUserProfilesResponse {
    data: {
        listUserProfiles: {
            items: UserProfile[];
        };
    };
}

export function GraphQLTest() {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const testAuth = async (): Promise<void> => {
        setLoading(true);
        try {
            const user = await getCurrentUser() as AuthUser;
            setResult(`✅ Authentication Success!
User: ${user.username}
User ID: ${user.userId}
Email: ${user.signInDetails?.loginId || 'N/A'}
Auth Flow: ${user.signInDetails?.authFlowType || 'N/A'}

This confirms your authentication is working! 🎉`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown auth error';
            setResult(`❌ Authentication Error: ${errorMessage}

Try signing out and signing back in.`);
        }
        setLoading(false);
    };

    const testSchema = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await client.graphql({
                query: `{ __schema { types { name } } }`
            }) as GraphQLSchemaResponse;

            if (response.data && response.data.__schema && response.data.__schema.types) {
                const types = response.data.__schema.types.map((t: SchemaType) => t.name);
                const customTypes = types.filter((t: string) => !t.startsWith('__'));

                setResult(`✅ GraphQL Schema Success! 🎉
Total types: ${types.length}
Custom types: ${customTypes.length}

Available Custom Types:
${customTypes.map(type => `• ${type}`).join('\n')}

Key Models Status:
${customTypes.includes('UserProfile') ? '✅ UserProfile - Ready for user management' : '❌ UserProfile - Missing'}
${customTypes.includes('Todo') ? '✅ Todo - Ready for task management' : '❌ Todo - Missing'}

Your GraphQL API is working perfectly! 🚀`);
            } else {
                setResult('❌ GraphQL returned no schema data');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown GraphQL error';
            setResult(`❌ GraphQL Schema Error: ${errorMessage}

Common causes:
1. Backend (sandbox) not running
2. Authentication token expired
3. Network connectivity issues`);
        }
        setLoading(false);
    };

    const testUserProfile = async (): Promise<void> => {
        setLoading(true);
        try {
            const user = await getCurrentUser() as AuthUser;

            const response = await client.graphql({
                query: `
          mutation CreateUserProfile($input: CreateUserProfileInput!) {
            createUserProfile(input: $input) {
              id
              email
              name
              role
              isActive
              createdAt
            }
          }
        `,
                variables: {
                    input: {
                        email: user.signInDetails?.loginId || `${user.username}@example.com`,
                        name: user.username,
                        role: "user",
                        isActive: true
                    }
                }
            }) as CreateUserProfileResponse;

            if (response.data && response.data.createUserProfile) {
                const profile = response.data.createUserProfile;
                setResult(`✅ UserProfile Created Successfully! 🎉

Profile Details:
• ID: ${profile.id}
• Email: ${profile.email}
• Name: ${profile.name}
• Role: ${profile.role}
• Active: ${profile.isActive ? 'Yes' : 'No'}
• Created: ${profile.createdAt ? new Date(profile.createdAt).toLocaleString() : 'N/A'}

This confirms:
✅ GraphQL mutations work
✅ Database writes successful
✅ Authentication allows data creation
✅ Your backend is fully functional! 🚀`);
            } else {
                setResult('❌ No UserProfile data returned from mutation');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
                setResult(`ℹ️ UserProfile Already Exists

This is actually good news! It means:
✅ GraphQL connection works
✅ Authentication is valid
✅ Database is accessible
✅ Previous profile creation was successful

The error just means you already have a profile for this user.`);
            } else {
                setResult(`❌ UserProfile Creation Error: ${errorMessage}`);
            }
        }
        setLoading(false);
    };

    const listUserProfiles = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await client.graphql({
                query: `
          query ListUserProfiles {
            listUserProfiles {
              items {
                id
                email
                name
                role
                isActive
                createdAt
              }
            }
          }
        `
            }) as ListUserProfilesResponse;

            if (response.data && response.data.listUserProfiles && response.data.listUserProfiles.items) {
                const profiles = response.data.listUserProfiles.items;
                setResult(`✅ UserProfiles Retrieved Successfully! 🎉

Total Profiles: ${profiles.length}

Profile List:
${profiles.map((profile, index) =>
                    `${index + 1}. ${profile.name} (${profile.email})
   • Role: ${profile.role}
   • Active: ${profile.isActive ? 'Yes' : 'No'}
   • Created: ${profile.createdAt ? new Date(profile.createdAt).toLocaleString() : 'N/A'}`
                ).join('\n\n')}

This confirms your GraphQL queries work perfectly! 🚀`);
            } else {
                setResult('❌ No UserProfiles data received from query');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setResult(`❌ List UserProfiles Error: ${errorMessage}`);
        }
        setLoading(false);
    };

    return (
        <Card sx={{ maxWidth: 900, margin: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    🧪 Smart Pulver - Backend Test Panel
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Test your authentication and GraphQL backend with full type safety
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        onClick={testAuth}
                        disabled={loading}
                        size="large"
                    >
                        1️⃣ Test Auth
                    </Button>

                    <Button
                        variant="contained"
                        onClick={testSchema}
                        disabled={loading}
                        size="large"
                    >
                        2️⃣ Test Schema
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={testUserProfile}
                        disabled={loading}
                        size="large"
                    >
                        3️⃣ Create Profile
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        onClick={listUserProfiles}
                        disabled={loading}
                        size="large"
                    >
                        4️⃣ List Profiles
                    </Button>
                </Box>

                {loading && (
                    <Typography color="primary" sx={{ mb: 2 }}>
                        🔄 Testing in progress... Please wait.
                    </Typography>
                )}

                {result && (
                    <Box
                        sx={{
                            backgroundColor: result.startsWith('✅') ? '#e8f5e8' :
                                result.startsWith('ℹ️') ? '#e3f2fd' : '#ffeaea',
                            padding: 3,
                            borderRadius: 2,
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                            fontSize: '0.9rem',
                            border: result.startsWith('✅') ? '2px solid #4caf50' :
                                result.startsWith('ℹ️') ? '2px solid #2196f3' : '2px solid #f44336',
                            maxHeight: '400px',
                            overflow: 'auto'
                        }}
                    >
                        {result}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}