import { useState, useEffect } from 'react';
import { getQuestions, getUserInteractions } from '../utils/api';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    solvedQuestions: 0,
    bookmarkedQuestions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [questionsResponse, interactionsResponse] = await Promise.all([
        getQuestions(),
        getUserInteractions()
      ]);

      const solved = interactionsResponse.filter(interaction => interaction.solved).length;
      const bookmarked = interactionsResponse.filter(interaction => interaction.bookmarked).length;

      setStats({
        totalQuestions: questionsResponse.length,
        solvedQuestions: solved,
        bookmarkedQuestions: bookmarked
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="main-content">
      <h1>Welcome back, {user.username}!</h1>
      
      <div className="dashboard">
        <div className="dashboard-card">
          <h3>Total Questions</h3>
          <span className="card-stat">{stats.totalQuestions}</span>
          <p>Questions available in the database</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Solved Questions</h3>
          <span className="card-stat">{stats.solvedQuestions}</span>
          <p>Questions you've successfully solved</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Bookmarked Questions</h3>
          <span className="card-stat">{stats.bookmarkedQuestions}</span>
          <p>Questions you've bookmarked for later</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Success Rate</h3>
          <span className="card-stat">
            {stats.totalQuestions > 0 
              ? Math.round((stats.solvedQuestions / stats.totalQuestions) * 100) 
              : 0}%
          </span>
          <p>Percentage of questions solved</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;