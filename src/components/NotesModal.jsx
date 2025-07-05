import { useState } from 'react';

function NotesModal({ question, currentNote, onSave, onClose }) {
  const [note, setNote] = useState(currentNote);

  const handleSave = () => {
    onSave(note);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add Note</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="form-group">
          <label>Question:</label>
          <p>{question.question_text}</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="note">Personal Note:</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add your thoughts, approach, or solution notes..."
            rows="6"
          />
        </div>
        
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave}>
            Save Note
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotesModal;