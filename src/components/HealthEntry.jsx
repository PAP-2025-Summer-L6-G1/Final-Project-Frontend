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

  const renderEntryContent = (entry) => {
    switch (entry.type) {
      case 'weight':
        return (
          <div className="entry-content">
            <div className="entry-main">
              <span className="entry-value">{entry.value} {entry.unit}</span>
            </div>
            {entry.notes && <p className="entry-notes">{entry.notes}</p>}
          </div>
        );

      case 'blood_pressure':
        return (
          <div className="entry-content">
            <div className="entry-main">
              <span className="entry-value">{entry.systolic}/{entry.diastolic} mmHg</span>
            </div>
            {entry.notes && <p className="entry-notes">{entry.notes}</p>}
          </div>
        );

      case 'meal':
        return (
          <div className="entry-content">
            <div className="entry-main">
              <span className="entry-meal-type">{entry.mealType}</span>
              {entry.calories && <span className="entry-calories">{entry.calories} cal</span>}
            </div>
            {entry.nutrition && (
              <div className="nutrition-info">
                <span>P: {entry.nutrition.protein}g</span>
                <span>C: {entry.nutrition.carbs}g</span>
                <span>F: {entry.nutrition.fat}g</span>
                {entry.nutrition.fiber && <span>Fiber: {entry.nutrition.fiber}g</span>}
              </div>
            )}
            {entry.notes && <p className="entry-notes">{entry.notes}</p>}
          </div>
        );

      case 'workout':
        return (
          <div className="entry-content">
            <div className="entry-main">
              <span className="entry-workout-type">{entry.workoutType}</span>
              {entry.duration && <span className="entry-duration">{entry.duration} min</span>}
            </div>
            {entry.exercises && entry.exercises.length > 0 && (
              <div className="exercises-info">
                <span>{entry.exercises.length} exercise{entry.exercises.length !== 1 ? 's' : ''}</span>
                <div className="exercise-list">
                  {entry.exercises.slice(0, 3).map((exercise, index) => (
                    <span key={index} className="exercise-item">
                      {exercise.name}
                      {exercise.sets && exercise.reps && ` (${exercise.sets}×${exercise.reps})`}
                    </span>
                  ))}
                  {entry.exercises.length > 3 && (
                    <span className="more-exercises">+{entry.exercises.length - 3} more</span>
                  )}
                </div>
              </div>
            )}
            {entry.notes && <p className="entry-notes">{entry.notes}</p>}
          </div>
        );

      default:
        return (
          <div className="entry-content">
            <div className="entry-main">
              <span className="entry-value">{entry.value} {entry.unit}</span>
            </div>
            {entry.notes && <p className="entry-notes">{entry.notes}</p>}
          </div>
        );
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
            
            {renderEntryContent(entry)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HealthEntryList;