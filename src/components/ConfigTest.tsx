import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';

const ConfigTest: React.FC = () => {

    const [config, setConfig] = useState<unknown>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            // Get current Amplify configuration
            const currentConfig = Amplify.getConfig();
            setConfig(currentConfig);
            console.log('🔧 Current Amplify Config:', currentConfig);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Configuration error');
            console.error('❌ Configuration error:', err);
        }
    }, []);


    if (error) {
        return (
            <div style={{
                padding: '20px',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '5px',
                margin: '20px 0'
            }}>
                <h3>❌ Configuration Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!config) {
        return <div>Loading configuration...</div>;
    }

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#f0f8ff',
            border: '1px solid #cce7ff',
            borderRadius: '5px',
            margin: '20px 0'
        }}>
            <h3>🔧 Amplify Configuration Status</h3>
            {/* Auth Configuration */}
            {config.Auth ? (
                <div style={{ marginBottom: '15px' }}>
                    <h4>✅ Auth Configured</h4>
                    <div><strong>Region:</strong> {config.Auth.Cognito?.userPoolId ? 'Configured' : 'Not configured'}</div>
                </div>
            ) : (
                <div style={{ marginBottom: '15px', color: '#d63384' }}>
                    <h4>❌ Auth Not Configured</h4>
                </div>
            )}

            {/* API Configuration */}
            {config.API?.GraphQL ? (
                <div style={{ marginBottom: '15px' }}>
                    <h4>✅ GraphQL API Configured</h4>
                    <div><strong>Endpoint:</strong> {config.API.GraphQL.endpoint}</div>
                    <div><strong>Region:</strong> {config.API.GraphQL.region}</div>
                    <div><strong>Auth Mode:</strong> {config.API.GraphQL.defaultAuthMode}</div>
                </div>
            ) : (
                <div style={{ marginBottom: '15px', color: '#d63384' }}>
                    <h4>❌ GraphQL API Not Configured</h4>
                </div>
            )}
        </div>
    );
}
export default ConfigTest;