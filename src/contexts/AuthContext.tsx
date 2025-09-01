// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';

// Use the client without explicit schema typing for now
const client = generateClient();

interface User {
    id: string;
    email: string;
    name?: string;
    role: 'admin' | 'manager' | 'user' | 'viewer';
    isActive: boolean;
    groups?: string[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    hasRole: (role: string) => boolean;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            setLoading(true);

            // Get current authenticated user
            const currentUser = await getCurrentUser();
            const session = await fetchAuthSession();

            // Get user groups from token
            const groups = session.tokens?.accessToken?.payload?.['cognito:groups'] as string[] || [];

            // Try to get user profile from our database
            let userProfile = null;
            try {
                const profiles = await client.models.UserProfile.list({
                    filter: { email: { eq: currentUser.signInDetails?.loginId } }
                });
                userProfile = profiles.data[0];
            } catch (profileError) {
                console.log('No user profile found, will create one');
            }

            // Create user profile if it doesn't exist
            if (!userProfile && currentUser.signInDetails?.loginId) {
                try {
                    const defaultRole = groups.includes('admin') ? 'admin' : 'user';
                    const newProfile = await client.models.UserProfile.create({
                        email: currentUser.signInDetails.loginId,
                        name: currentUser.signInDetails.loginId.split('@')[0],
                        role: defaultRole,
                        isActive: true,
                        lastLogin: new Date().toISOString(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    });
                    userProfile = newProfile.data;
                } catch (createError) {
                    console.error('Error creating user profile:', createError);
                }
            }

            // Update last login
            if (userProfile) {
                try {
                    await client.models.UserProfile.update({
                        id: userProfile.id,
                        lastLogin: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    });
                } catch (updateError) {
                    console.log('Could not update last login:', updateError);
                }
            }

            setUser({
                id: currentUser.userId,
                email: currentUser.signInDetails?.loginId || '',
                name: userProfile?.name || currentUser.signInDetails?.loginId?.split('@')[0],
                role: userProfile?.role || (groups.includes('admin') ? 'admin' : 'user'),
                isActive: userProfile?.isActive ?? true,
                groups,
            });
        } catch (authError) {
            console.log('No authenticated user:', authError);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
        } catch (signOutError) {
            console.error('Error signing out:', signOutError);
        }
    };

    const hasRole = (role: string): boolean => {
        if (!user) return false;

        const roleHierarchy = {
            admin: ['admin', 'manager', 'user', 'viewer'],
            manager: ['manager', 'user', 'viewer'],
            user: ['user', 'viewer'],
            viewer: ['viewer'],
        };

        return roleHierarchy[user.role as keyof typeof roleHierarchy]?.includes(role) || false;
    };

    const hasPermission = (permission: string): boolean => {
        if (!user) return false;

        const permissions = {
            admin: ['read', 'write', 'delete', 'manage_users', 'view_analytics'],
            manager: ['read', 'write', 'view_analytics'],
            user: ['read', 'write'],
            viewer: ['read'],
        };

        return permissions[user.role]?.includes(permission) || false;
    };

    useEffect(() => {
        loadUser();
    }, []);

    const value = {
        user,
        loading,
        signOut: handleSignOut,
        refreshUser: loadUser,
        hasRole,
        hasPermission,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
