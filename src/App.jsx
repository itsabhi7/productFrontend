import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Questions from './components/Questions';
import DailyChallenge from './components/DailyChallenge';
import AdminPanel from './components/AdminPanel';
import Navbar from './components/Navbar';
import { getAuthToken, getUser } from './utils/auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const userData = getUser();
      setUser(userData);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} setUser={setUser} />}
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/questions" 
            element={user ? <Questions user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/daily-challenge" 
            element={user ? <DailyChallenge user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminPanel user={user} /> : <Navigate to="/dashboard" />} 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;