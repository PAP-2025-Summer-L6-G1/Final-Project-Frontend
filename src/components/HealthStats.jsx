import './HealthStats.css';

function HealthStats({ entries }) {
  const calculateStats = () => {
    const stats = {
      totalEntries: entries.length,
      byType: {
        weight: 0,
        blood_pressure: 0,
        meal: 0,
        workout: 0
      },
      recentEntries: 0
    };

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    entries.forEach(entry => {
      stats.byType[entry.type]++;
      
      const entryDate = new Date(entry.date);
      if (entryDate >= oneWeekAgo) {
        stats.recentEntries++;
      }
    });

    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="health-stats">
      <h3>Health Overview</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalEntries}</div>
            <div className="stat-label">Total Entries</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.recentEntries}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
      </div>

      <div className="entry-breakdown">
        <h4>Entry Breakdown</h4>
        <div className="breakdown-list">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="breakdown-item">
              <div className="breakdown-icon">
                {type === 'weight' && '⚖️'}
                {type === 'blood_pressure' && '❤️'}
                {type === 'meal' && '🍽️'}
                {type === 'workout' && '💪'}
              </div>
              <div className="breakdown-content">
                <span className="breakdown-type">{type.replace('_', ' ')}</span>
                <span className="breakdown-count">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {stats.totalEntries === 0 && (
        <div className="empty-stats">
          <p>No health data yet. Start tracking to see your stats!</p>
        </div>
      )}
    </div>
  );
}

export default HealthStats;