import { useState } from 'react'

function TestLogin() {
  const [testUser, setTestUser] = useState(null)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const handleTestLogin = () => {
    // Simulate a successful login for testing
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://via.placeholder.com/40'
    }
    setTestUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    window.location.reload()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1>Login Test Page</h1>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f3f4f6',
          borderRadius: '8px',
          textAlign: 'left'
        }}>
          <h3>Environment Check:</h3>
          <p>✓ Client ID configured: <strong>{clientId ? 'Yes' : 'No'}</strong></p>
          <p>✓ Client ID length: <strong>{clientId?.length || 0}</strong></p>
          <p>✓ Running on: <strong>{window.location.origin}</strong></p>
          {clientId && (
            <p style={{ fontSize: '0.75rem', wordBreak: 'break-all', marginTop: '1rem' }}>
              Client ID: {clientId}
            </p>
          )}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={handleTestLogin}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Use Test Login (Skip Google OAuth)
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#fef3c7',
          borderRadius: '8px',
          fontSize: '0.875rem',
          textAlign: 'left'
        }}>
          <strong>Note:</strong> This test login lets you bypass Google OAuth to test the calendar functionality.
          Use this if you're having OAuth setup issues.
        </div>
      </div>
    </div>
  )
}

export default TestLogin
