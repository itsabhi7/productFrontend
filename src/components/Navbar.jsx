import { Link, useLocation } from 'react-router-dom';
import { removeAuthToken } from '../utils/auth';

function Navbar({ user, setUser }) {
  const location = useLocation();

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          Interview Prep Board
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/questions" 
              className={`nav-link ${isActive('/questions') ? 'active' : ''}`}
            >
              Questions
            </Link>
          </li>
          <li>
            <Link 
              to="/daily-challenge" 
              className={`nav-link ${isActive('/daily-challenge') ? 'active' : ''}`}
            >
              Daily Challenge
            </Link>
          </li>
          {user?.role === 'admin' && (
            <li>
              <Link 
                to="/admin" 
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              >
                Admin Panel
              </Link>
            </li>
          )}
        </ul>

        <div className="user-info">
          <span className="user-role">{user?.role}</span>
          <span>Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;