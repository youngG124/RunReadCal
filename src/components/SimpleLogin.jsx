import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { GOOGLE_CLIENT_ID } from '../config/google'
import './Login.css'

function SimpleLogin() {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = () => {
    setIsLoading(true)

    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
    const params = {
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: window.location.origin,
      response_type: 'token',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/drive.file'
      ].join(' '),
      include_granted_scopes: 'true',
      state: 'pass-through-value'
    }

    const url = oauth2Endpoint + '?' + new URLSearchParams(params).toString()
    window.location.href = url
  }

  useEffect(() => {
    // Check if we're coming back from OAuth redirect
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')

      if (accessToken) {
        // Fetch user info
        fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then(res => res.json())
          .then(userInfo => {
            login({
              name: userInfo.name,
              email: userInfo.email,
              picture: userInfo.picture,
              token: accessToken
            })
            // Clean up URL
            window.history.replaceState(null, '', window.location.pathname)
          })
          .catch(error => {
            console.error('Failed to get user info:', error)
            setIsLoading(false)
          })
      }
    }
  }, [])

  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_ACTUAL_CLIENT_ID_GOES_HERE.apps.googleusercontent.com') {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Developer Setup Required</h1>
            <p className="error-text">Google Client ID needs to be configured in the code</p>
          </div>
          <div className="setup-instructions">
            <h3>For the Developer:</h3>
            <ol>
              <li>Open <code>src/config/google.js</code></li>
              <li>Replace the Client ID with your actual Google OAuth Client ID</li>
              <li>Enable Google Drive API in Google Cloud Console</li>
              <li>Once set, users can login without any configuration!</li>
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
          <h1>Daily Run Tracker</h1>
          <p>Track your daily kilometers and sync with Google Drive</p>
        </div>
        <div className="login-content">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="google-login-btn"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '1rem' }}>
          Your data will be saved to your Google Drive
        </p>
      </div>
    </div>
  )
}

export default SimpleLogin
