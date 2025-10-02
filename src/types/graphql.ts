export interface GraphQLResponse<T = unknown> {
    data: T;
    errors?: Array<{
        message: string;
        locations?: Array<{
            line: number;
            column: number;
        }>;
        path?: string[];
    }>;
    extensions?: Record<string, unknown>;
}

// Schema types
export interface SchemaType {
    name: string;
}

export interface SchemaResponse {
    __schema: {
        types: SchemaType[];
    };
}

// UserProfile types
export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserProfileInput {
    email: string;
    name: string;
    role: string;
    isActive: boolean;
}

export interface CreateUserProfileResponse {
    createUserProfile: UserProfile;
}

export interface ListUserProfilesResponse {
    listUserProfiles: {
        items: UserProfile[];
        nextToken?: string;
    };
}

// Auth types
export interface AuthUser {
    username: string;
    userId: string;
    signInDetails?: {
        loginId?: string;
        authFlowType?: string;
    };
}

export interface AuthSession {
    tokens?: {
        idToken?: {
            toString(): string;
        };
        accessToken?: {
            toString(): string;
        };
    };
    credentials?: unknown;
}
