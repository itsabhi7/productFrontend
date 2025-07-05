import { useState, useEffect } from 'react';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '../utils/api';

function AdminPanel({ user }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question_text: '',
    type: 'MCQ',
    difficulty: 'Easy',
    company_tags: '',
    topic_tags: ''
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await getQuestions();
      setQuestions(response);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        const response = await updateQuestion(editingQuestion.id, formData);
        setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? response : q));
        setEditingQuestion(null);
      } else {
        const response = await createQuestion(formData);
        setQuestions(prev => [response, ...prev]);
      }
      
      setFormData({
        question_text: '',
        type: 'MCQ',
        difficulty: 'Easy',
        company_tags: '',
        topic_tags: ''
      });
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      question_text: question.question_text,
      type: question.type,
      difficulty: question.difficulty,
      company_tags: question.company_tags,
      topic_tags: question.topic_tags
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(id);
        setQuestions(prev => prev.filter(q => q.id !== id));
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setFormData({
      question_text: '',
      type: 'MCQ',
      difficulty: 'Easy',
      company_tags: '',
      topic_tags: ''
    });
  };

  if (loading) {
    return <div className="loading">Loading admin panel...</div>;
  }

  return (
    <div className="main-content">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage interview questions</p>
        </div>

        <div className="admin-form">
          <h3>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="question_text">Question Text</label>
              <textarea
                id="question_text"
                name="question_text"
                value={formData.question_text}
                onChange={handleFormChange}
                required
                placeholder="Enter the question text..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Question Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  required
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="CODE">Coding</option>
                  <option value="SUBJECTIVE">Subjective</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company_tags">Company Tags</label>
                <input
                  type="text"
                  id="company_tags"
                  name="company_tags"
                  value={formData.company_tags}
                  onChange={handleFormChange}
                  placeholder="Google, Facebook, Amazon (comma-separated)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="topic_tags">Topic Tags</label>
                <input
                  type="text"
                  id="topic_tags"
                  name="topic_tags"
                  value={formData.topic_tags}
                  onChange={handleFormChange}
                  placeholder="Arrays, Dynamic Programming, Trees (comma-separated)"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </button>
              {editingQuestion && (
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="questions-grid">
          {questions.map(question => (
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
                <div className="question-actions">
                  <button 
                    className="action-btn"
                    onClick={() => handleEdit(question)}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-btn admin-btn"
                    onClick={() => handleDelete(question.id)}
                  >
                    Delete
                  </button>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;