// React app using CDN versions
const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

// Material-UI components (if available)
const MaterialUI = window['MaterialUI'] || {};
const { 
  Button = 'button', 
  Card = 'div', 
  CardContent = 'div', 
  Typography = 'div',
  Box = 'div'
} = MaterialUI;

function TestPanel() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    setResult('🔄 Testing authentication...');
    
    setTimeout(() => {
      setResult(`✅ Authentication Test Successful!
      
This simulates:
• User login verification
• Token validation  
• Session management
• AWS Cognito integration

Ready to add real Amplify authentication! 🎉`);
      setLoading(false);
    }, 1500);
  };

  const testAPI = async () => {
    setLoading(true);
    setResult('🔄 Testing API connection...');
    
    setTimeout(() => {
      setResult(`✅ API Test Successful!
      
This simulates:
• GraphQL schema validation
• Database connectivity
• CRUD operations
• AWS AppSync integration

Ready to add real Amplify API! 🚀`);
      setLoading(false);
    }, 2000);
  };

  const testDatabase = async () => {
    setLoading(true);
    setResult('🔄 Testing database operations...');
    
    setTimeout(() => {
      setResult(`✅ Database Test Successful!
      
This simulates:
• User profile creation
• Data persistence
• Query operations
• Real-time updates

Ready to add real DynamoDB! 💾`);
      setLoading(false);
    }, 1800);
  };

  return React.createElement('div', {
    style: {
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto'
    }
  },
    // Header
    React.createElement('div', {
      style: {
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }
    },
      React.createElement('h1', {
        style: { margin: '0 0 10px 0', color: '#1976d2' }
      }, '🚀 Smart Pulver - CDN React Version'),
      
      React.createElement('p', {
        style: { margin: '0', color: '#666' }
      }, 'React loaded from CDN - No npm corruption issues!')
    ),
    
    // Test Panel
    React.createElement('div', {
      style: {
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }
    },
      React.createElement('h2', {
        style: { marginTop: '0' }
      }, '🧪 Backend Test Panel'),
      
      // Buttons
      React.createElement('div', {
        style: { marginBottom: '20px' }
      },
        React.createElement('button', {
          onClick: testAuth,
          disabled: loading,
          style: {
            background: loading ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            margin: '5px',
            fontSize: '16px'
          }
        }, '1️⃣ Test Authentication'),
        
        React.createElement('button', {
          onClick: testAPI,
          disabled: loading,
          style: {
            background: loading ? '#ccc' : '#2e7d32',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            margin: '5px',
            fontSize: '16px'
          }
        }, '2️⃣ Test API'),
        
        React.createElement('button', {
          onClick: testDatabase,
          disabled: loading,
          style: {
            background: loading ? '#ccc' : '#ed6c02',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            margin: '5px',
            fontSize: '16px'
          }
        }, '3️⃣ Test Database')
      ),
      
      // Results
      result && React.createElement('div', {
        style: {
          background: result.startsWith('✅') ? '#e8f5e8' : 
                     result.startsWith('🔄') ? '#e3f2fd' : '#ffeaea',
          padding: '20px',
          borderRadius: '5px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          fontSize: '14px',
          border: result.startsWith('✅') ? '2px solid #4caf50' : 
                 result.startsWith('🔄') ? '2px solid #2196f3' : '2px solid #f44336',
          marginTop: '20px'
        }
      }, result)
    )
  );
}

// Render the app
console.log('Starting CDN React app...');
const root = createRoot(document.getElementById('root'));
root.render(React.createElement(TestPanel));
console.log('✅ CDN React app loaded successfully!');
