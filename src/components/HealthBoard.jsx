import { useState, useEffect, useContext } from 'react';
import { AccountContext } from '../contexts/AccountContext';
import HealthEntryForm from '../components/HealthEntryForm';
import HealthEntryList from '../components/HealthEntryList';
import HealthStats from '../components/HealthStats';
import './HealthDashboard.css';

function HealthDashboard() {
  const { loggedInUser } = useContext(AccountContext);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:3002/health/${loggedInUser.userId}?type=${selectedType !== 'all' ? selectedType : ''}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      fetchEntries();
    }
  }, [loggedInUser, selectedType]);

  const handleCreateEntry = async (entryData) => {
    try {
      const response = await fetch('https://localhost:3002/health/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(entryData)
      });

      if (!response.ok) {
        throw new Error('Failed to create entry');
      }

      setShowForm(false);
      fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateEntry = async (entryId, updateData) => {
    try {
      const response = await fetch(`https://localhost:3002/health/${entryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update entry');
      }

      setEditingEntry(null);
      fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const response = await fetch(`https://localhost:3002/health/${entryId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  if (!loggedInUser) {
    return <div className="health-dashboard">Please log in to access your health dashboard.</div>;
  }

  return (
    <div className="health-dashboard">
      <div className="dashboard-header">
        <h1>Personal Health Dashboard</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingEntry(null);
          }}
        >
          Add New Entry
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="filter-section">
            <h3>Filter by Type</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedType('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${selectedType === 'weight' ? 'active' : ''}`}
                onClick={() => setSelectedType('weight')}
              >
                Weight
              </button>
              <button 
                className={`filter-btn ${selectedType === 'blood_pressure' ? 'active' : ''}`}
                onClick={() => setSelectedType('blood_pressure')}
              >
                Blood Pressure
              </button>
              <button 
                className={`filter-btn ${selectedType === 'meal' ? 'active' : ''}`}
                onClick={() => setSelectedType('meal')}
              >
                Meals
              </button>
              <button 
                className={`filter-btn ${selectedType === 'workout' ? 'active' : ''}`}
                onClick={() => setSelectedType('workout')}
              >
                Workouts
              </button>
            </div>
          </div>

          <HealthStats entries={entries} />
        </div>

        <div className="main-content">
          {showForm && (
            <HealthEntryForm
              onSubmit={editingEntry ? handleUpdateEntry : handleCreateEntry}
              onCancel={() => {
                setShowForm(false);
                setEditingEntry(null);
              }}
              entry={editingEntry}
            />
          )}

          {loading ? (
            <div className="loading">Loading entries...</div>
          ) : (
            <HealthEntryList
              entries={entries}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default HealthDashboard;