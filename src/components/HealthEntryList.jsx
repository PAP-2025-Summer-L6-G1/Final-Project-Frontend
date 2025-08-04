import './HealthEntryList.css';

function HealthEntryList({ entries, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEntryIcon = (type) => {
    switch (type) {
      case 'weight':
        return '⚖️';
      case 'blood_pressure':
        return '❤️';
      case 'meal':
        return '🍽️';
      case 'workout':
        return '💪';
      default:
        return '📊';
    }
  };

  const getEntryColor = (type) => {
    switch (type) {
      case 'weight':
        return '#3498db';
      case 'blood_pressure':
        return '#e74c3c';
      case 'meal':
        return '#f39c12';
      case 'workout':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <h3>No health entries yet</h3>
        <p>Start tracking your health by adding your first entry!</p>
      </div>
    );
  }

  return (
    <div className="health-entry-list">
      <div className="list-header">
        <h3>Health Entries ({entries.length})</h3>
      </div>
      
      <div className="entries-container">
        {entries.map((entry) => (
          <div 
            key={entry._id} 
            className="health-entry"
            style={{ borderLeftColor: getEntryColor(entry.type) }}
          >
            <div className="entry-header">
              <div className="entry-icon">
                {getEntryIcon(entry.type)}
              </div>
              <div className="entry-meta">
                <span className="entry-type">{entry.type.replace('_', ' ')}</span>
                <span className="entry-date">{formatDate(entry.date)}</span>
              </div>
              <div className="entry-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEdit(entry)}
                  title="Edit entry"
                >
                  ✏️
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(entry._id)}
                  title="Delete entry"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="entry-content">
              <div className="entry-main">
                <span className="entry-value">{entry.value} {entry.unit}</span>
              </div>
              {entry.notes && <p className="entry-notes">{entry.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HealthEntryList; 