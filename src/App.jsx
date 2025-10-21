import { useAuth } from './context/AuthContext'
import Calendar from './components/Calendar'
import SimpleLogin from './components/SimpleLogin'
import TestLogin from './components/TestLogin'
import './App.css'

function App() {
  const { user, isLoading, logout } = useAuth()
  const useTestMode = import.meta.env.VITE_USE_TEST_LOGIN === 'true'

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return useTestMode ? <TestLogin /> : <SimpleLogin />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Daily Run Tracker</h1>
            <p>Document and track your daily kilometers</p>
          </div>
          <div className="user-section">
            <img src={user.picture} alt={user.name} className="user-avatar" />
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </div>
          </div>
        </div>
      </header>
      <Calendar />
    </div>
  )
}

export default App
