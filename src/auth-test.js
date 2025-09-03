import { Amplify } from 'aws-amplify';
import { signUp, signIn, signOut, getCurrentUser } from 'aws-amplify/auth';

// Configure Amplify
const configureAmplify = async () => {
  try {
    const response = await fetch('/amplify_outputs.json');
    const config = await response.json();
    Amplify.configure(config);
    console.log('✅ Amplify configured');
    return true;
  } catch (error) {
    console.error('❌ Failed to configure Amplify:', error);
    return false;
  }
};

// Simple auth test component
const { useState, useEffect } = React;

function AuthTest() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState('');

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const configured = await configureAmplify();
    if (configured) {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setResult(`✅ User authenticated: ${currentUser.username}`);
      } catch (error) {
        setResult('ℹ️ No authenticated user');
      }
    } else {
      setResult('❌ Failed to configure Amplify');
    }
    setLoading(false);
  };

  const testSignUp = async () => {
    setLoading(true);
    try {
      const { user } = await signUp({
        username: 'test@example.com',
        password: 'TempPass123!',
        attributes: { email: 'test@example.com' }
      });
      setResult(`✅ Sign up successful: ${user.username}`);
    } catch (error) {
      setResult(`❌ Sign up failed: ${error.message}`);
    }
    setLoading(false);
  };

  return React.createElement('div', { style: { padding: '20px' } },
    React.createElement('h1', null, '🔐 Auth Test'),
    React.createElement('button', {
      onClick: testSignUp,
      disabled: loading
    }, 'Test Sign Up'),
    React.createElement('div', { style: { marginTop: '20px' } }, result)
  );
}

window.AuthTest = AuthTest;
