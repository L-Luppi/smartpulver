import React, { useState, useEffect } from 'react';
import { getCurrentUser, signOut, signIn, signUp, confirmSignUp } from 'aws-amplify/auth';

function App() {
    const [user, setUser] = useState(null);
    const [authMode, setAuthMode] = useState('signin'); // 'signin', 'signup', 'confirm'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmationCode: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if user is already authenticated
    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (err) {
            console.log('No authenticated user');
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signIn({
                username: formData.email,
                password: formData.password
            });
            await checkAuthState();
        } catch (err) {
            setError(err.message || 'Sign in failed');
        }
        setLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signUp({
                username: formData.email,
                password: formData.password,
                options: {
                    userAttributes: {
                        email: formData.email
                    }
                }
            });
            setAuthMode('confirm');
        } catch (err) {
            setError(err.message || 'Sign up failed');
        }
        setLoading(false);
    };

    const handleConfirmSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await confirmSignUp({
                username: formData.email,
                confirmationCode: formData.confirmationCode
            });
            setAuthMode('signin');
            setFormData({ ...formData, confirmationCode: '' });
        } catch (err) {
            setError(err.message || 'Confirmation failed');
        }
        setLoading(false);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
        } catch (err) {
            setError(err.message || 'Sign out failed');
        }
    };

    // If user is authenticated, show dashboard
    if (user) {
        return (
            <div className="auth-container">
                <h1>🚀 Smart Pulver Dashboard</h1>
                <div className="user-info">
                    <h3>Welcome!</h3>
                    <p><strong>User ID:</strong> {user.userId}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                </div>
                <button className="auth-button" onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
        );
    }

    // Authentication forms
    return (
        <div className="auth-container">
            <h1>🚀 Smart Pulver</h1>

            {error && (
                <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#ffe6e6', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            {authMode === 'signin' && (
                <form className="auth-form" onSubmit={handleSignIn}>
                    <h2>Sign In</h2>
                    <input
                        className="auth-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        className="auth-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <button className="auth-button" type="submit" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <p>
                        Don't have an account?{' '}
                        <button type="button" onClick={() => setAuthMode('signup')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                            Sign Up
                        </button>
                    </p>
                </form>
            )}

            {authMode === 'signup' && (
                <form className="auth-form" onSubmit={handleSignUp}>
                    <h2>Sign Up</h2>
                    <input
                        className="auth-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        className="auth-input"
                        type="password"
                        name="password"
                        placeholder="Password (min 8 characters)"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={8}
                    />
                    <button className="auth-button" type="submit" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                    <p>
                        Already have an account?{' '}
                        <button type="button" onClick={() => setAuthMode('signin')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                            Sign In
                        </button>
                    </p>
                </form>
            )}

            {authMode === 'confirm' && (
                <form className="auth-form" onSubmit={handleConfirmSignUp}>
                    <h2>Confirm Sign Up</h2>
                    <p>Please check your email for the confirmation code.</p>
                    <input
                        className="auth-input"
                        type="text"
                        name="confirmationCode"
                        placeholder="Confirmation Code"
                        value={formData.confirmationCode}
                        onChange={handleInputChange}
                        required
                    />
                    <button className="auth-button" type="submit" disabled={loading}>
                        {loading ? 'Confirming...' : 'Confirm'}
                    </button>
                    <p>
                        <button type="button" onClick={() => setAuthMode('signin')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                            Back to Sign In
                        </button>
                    </p>
                </form>
            )}
        </div>
    );
}
export default App;
