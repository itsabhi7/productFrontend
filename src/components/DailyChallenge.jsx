import { useState, useEffect } from 'react';
import { getDailyChallenge, completeDailyChallenge } from '../utils/api';

function DailyChallenge({ user }) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenge();
  }, []);

  const loadChallenge = async () => {
    try {
      const response = await getDailyChallenge();
      setChallenge(response);
    } catch (error) {
      console.error('Error loading daily challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await completeDailyChallenge();
      setChallenge(response);
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading daily challenge...</div>;
  }

  if (!challenge || !challenge.question) {
    return (
      <div className="main-content">
        <div className="daily-challenge-container">
          <div className="challenge-card">
            <h1>Daily Challenge</h1>
            <p>No challenge available today. Please check back later!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="daily-challenge-container">
        <div className="challenge-card">
          <div className="challenge-header">
            <h1>Daily Challenge</h1>
            <p className="challenge-date">
              {new Date(challenge.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className={`challenge-status ${challenge.completed ? 'status-completed' : 'status-pending'}`}>
            {challenge.completed ? 'Completed ✓' : 'Pending'}
          </div>
          
          <div className="question-card">
            <div className="question-header">
              <div className="question-meta">
                <span className={`question-badge difficulty-${challenge.question.difficulty.toLowerCase()}`}>
                  {challenge.question.difficulty}
                </span>
                <span className="question-badge">
                  {challenge.question.type}
                </span>
              </div>
            </div>
            
            <div className="question-text">
              {challenge.question.question_text}
            </div>
            
            {(challenge.question.company_tags || challenge.question.topic_tags) && (
              <div className="question-tags">
                {challenge.question.company_tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                  <span key={index} className="tag">{tag.trim()}</span>
                ))}
                {challenge.question.topic_tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                  <span key={index} className="tag">{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
          
          {!challenge.completed && (
            <button 
              className="complete-btn"
              onClick={handleComplete}
            >
              Mark as Completed
            </button>
          )}
          
          {challenge.completed && (
            <div className="text-center">
              <p>🎉 Congratulations! You've completed today's challenge!</p>
              <p>Come back tomorrow for a new challenge.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyChallenge;