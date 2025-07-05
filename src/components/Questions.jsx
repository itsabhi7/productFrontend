import { useState, useEffect } from 'react';
import { getQuestions, getUserInteractions, createUpdateInteraction } from '../utils/api';
import NotesModal from './NotesModal';

function Questions({ user }) {
  const [questions, setQuestions] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: '',
    type: '',
    solved: '',
    bookmarked: ''
  });
  const [modalQuestion, setModalQuestion] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [questionsResponse, interactionsResponse] = await Promise.all([
        getQuestions(),
        getUserInteractions()
      ]);
      setQuestions(questionsResponse);
      setInteractions(interactionsResponse);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInteraction = (questionId) => {
    return interactions.find(interaction => interaction.question?.id === questionId);
  };

  const handleInteractionUpdate = async (questionId, updates) => {
    try {
      const response = await createUpdateInteraction({
        question_id: questionId,
        ...updates
      });
      
      setInteractions(prev => {
        const existingIndex = prev.findIndex(interaction => interaction.question?.id === questionId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = response;
          return updated;
        } else {
          return [...prev, response];
        }
      });
    } catch (error) {
      console.error('Error updating interaction:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredQuestions = questions.filter(question => {
    const interaction = getInteraction(question.id);
    
    if (filters.difficulty && question.difficulty !== filters.difficulty) return false;
    if (filters.type && question.type !== filters.type) return false;
    if (filters.solved && interaction?.solved !== (filters.solved === 'true')) return false;
    if (filters.bookmarked && interaction?.bookmarked !== (filters.bookmarked === 'true')) return false;
    
    return true;
  });

  const openNotesModal = (question) => {
    setModalQuestion(question);
  };

  const closeNotesModal = () => {
    setModalQuestion(null);
  };

  const saveNote = async (note) => {
    if (modalQuestion) {
      await handleInteractionUpdate(modalQuestion.id, { 
        personal_note: note,
        bookmarked: getInteraction(modalQuestion.id)?.bookmarked || false,
        solved: getInteraction(modalQuestion.id)?.solved || false
      });
      closeNotesModal();
    }
  };

  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  return (
    <div className="main-content">
      <div className="questions-header">
        <h1>Questions</h1>
      </div>

      <div className="filters">
        <select 
          className="filter-select" 
          value={filters.difficulty} 
          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select 
          className="filter-select" 
          value={filters.type} 
          onChange={(e) => handleFilterChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="MCQ">MCQ</option>
          <option value="CODE">Coding</option>
          <option value="SUBJECTIVE">Subjective</option>
        </select>

        <select 
          className="filter-select" 
          value={filters.solved} 
          onChange={(e) => handleFilterChange('solved', e.target.value)}
        >
          <option value="">All Questions</option>
          <option value="true">Solved</option>
          <option value="false">Unsolved</option>
        </select>

        <select 
          className="filter-select" 
          value={filters.bookmarked} 
          onChange={(e) => handleFilterChange('bookmarked', e.target.value)}
        >
          <option value="">All Questions</option>
          <option value="true">Bookmarked</option>
          <option value="false">Not Bookmarked</option>
        </select>
      </div>

      <div className="questions-grid">
        {filteredQuestions.map(question => {
          const interaction = getInteraction(question.id);
          
          return (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <div className="question-meta">
                  <span className={`question-badge difficulty-${question.difficulty.toLowerCase()}`}>
                    {question.difficulty}
                  </span>
                  <span className="question-badge">
                    {question.type}
                  </span>
                </div>
              </div>
              
              <div className="question-text">
                {question.question_text}
              </div>
              
              {(question.company_tags || question.topic_tags) && (
                <div className="question-tags">
                  {question.company_tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                    <span key={index} className="tag">{tag.trim()}</span>
                  ))}
                  {question.topic_tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                    <span key={index} className="tag">{tag.trim()}</span>
                  ))}
                </div>
              )}
              
              <div className="question-actions">
                <button 
                  className={`action-btn bookmark-btn ${interaction?.bookmarked ? 'active' : ''}`}
                  onClick={() => handleInteractionUpdate(question.id, { 
                    bookmarked: !interaction?.bookmarked,
                    solved: interaction?.solved || false,
                    personal_note: interaction?.personal_note || ''
                  })}
                >
                  {interaction?.bookmarked ? '★' : '☆'} Bookmark
                </button>
                
                <button 
                  className={`action-btn solve-btn ${interaction?.solved ? 'active' : ''}`}
                  onClick={() => handleInteractionUpdate(question.id, { 
                    solved: !interaction?.solved,
                    bookmarked: interaction?.bookmarked || false,
                    personal_note: interaction?.personal_note || ''
                  })}
                >
                  {interaction?.solved ? '✓' : '○'} Solved
                </button>
                
                <button 
                  className={`action-btn note-btn ${interaction?.personal_note ? 'active' : ''}`}
                  onClick={() => openNotesModal(question)}
                >
                  📝 Notes
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalQuestion && (
        <NotesModal 
          question={modalQuestion}
          currentNote={getInteraction(modalQuestion.id)?.personal_note || ''}
          onSave={saveNote}
          onClose={closeNotesModal}
        />
      )}
    </div>
  );
}

export default Questions;