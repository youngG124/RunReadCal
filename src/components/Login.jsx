import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import './Login.css'

function Login() {
  const { login } = useAuth()
  const [error, setError] = useState('')
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  // Debug: Log client ID status (not the actual ID for security)
  console.log('Client ID configured:', !!clientId)
  console.log('Client ID length:', clientId?.length || 0)

  const handleSuccess = (credentialResponse) => {
    try {
      // Decode JWT token to get user info
      const token = credentialResponse.credential
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )

      const userInfo = JSON.parse(jsonPayload)

      login({
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        token: token
      })
    } catch (err) {
      setError('Failed to process login. Please try again.')
      console.error('Login processing error:', err)
    }
  }

  const handleError = (error) => {
    console.error('Login Failed:', error)
    setError('Login failed. Please check your setup and try again.')
  }

  if (!clientId) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Configuration Required</h1>
            <p className="error-text">Google Client ID is not configured</p>
          </div>
          <div className="setup-instructions">
            <h3>Setup Instructions:</h3>
            <ol>
              <li>Create a <code>.env</code> file in the project root</li>
              <li>Add: <code>VITE_GOOGLE_CLIENT_ID=your-client-id</code></li>
              <li>Get your Client ID from Google Cloud Console</li>
              <li>Restart the dev server</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Daily Routine Tracker</h1>
          <p>Track your daily kilometers and sync with Google Drive</p>
        </div>

        <div style={{
          background: '#f3f4f6',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}>
          <strong>Debug Info:</strong>
          <div>Client ID set: {clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com' ? '✓ Yes' : '✗ No (using placeholder)'}</div>
          <div>Origin: {window.location.origin}</div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com' ? (
          <div className="error-message">
            Please replace the placeholder in .env file with your actual Google Client ID
          </div>
        ) : (
          <div className="login-content">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="outline"
              size="large"
              text="signin_with"
              auto_select={false}
              cancel_on_tap_outside={true}
            />
          </div>
        )}

        <div className="help-section">
          <details>
            <summary>Getting 400 error? Common fixes:</summary>
            <div className="help-content">
              <p><strong>In Google Cloud Console, verify:</strong></p>
              <ul>
                <li>Authorized JavaScript origins: <code>http://localhost:5173</code> (exact match)</li>
                <li>Authorized redirect URIs: Leave completely EMPTY</li>
                <li>Application type: Web application</li>
                <li>OAuth consent screen is configured</li>
              </ul>
              <p><strong>In your .env file:</strong></p>
              <ul>
                <li>Replace placeholder with actual Client ID</li>
                <li>No quotes around the Client ID</li>
                <li>No spaces or extra characters</li>
              </ul>
              <p><strong>After changes:</strong></p>
              <ul>
                <li>Restart dev server (Ctrl+C, then npm run dev)</li>
                <li>Clear browser cache or use incognito</li>
                <li>Wait 2-3 minutes after Google Cloud changes</li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

export default Login
