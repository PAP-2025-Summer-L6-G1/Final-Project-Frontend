import { useState, useEffect, useContext } from 'react';
import AccountContext from '../contexts/AccountContext';
import HealthEntryForm from '../components/HealthEntryForm';
import HealthEntryList from '../components/HealthEntryList';
import HealthStats from '../components/HealthStats';
import './HealthDashboard.css';

function HealthDashboard() {
  const { loggedInUser } = useContext(AccountContext);
  
  // For testing purposes, create a mock user if not logged in
  const testUser = loggedInUser || { userId: '507f1f77bcf86cd799439011', username: 'testuser' };
  
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const fetchEntries = async () => {
    if (!testUser || !testUser.userId) {
      console.log('testUser not available yet');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3002/health/${testUser.userId}?type=${selectedType !== 'all' ? selectedType : ''}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      
      const data = await response.json();
      console.log('Fetched entries:', data);
      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testUser && testUser.userId) {
      fetchEntries();
    }
  }, [selectedType, testUser]);

  const handleCreateEntry = async (entryData) => {
    try {
      // Optimistic update - add the entry immediately to the UI
      const optimisticEntry = {
        ...entryData,
        _id: 'temp-' + Date.now(), // temporary ID
        createdAt: new Date().toISOString(),
        isOptimistic: true // flag to identify optimistic entries
      };
      
      setEntries(prev => [optimisticEntry, ...prev]);
      setShowForm(false);

      const response = await fetch('http://localhost:3002/health/', {
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

      const createdEntry = await response.json();
      console.log('Entry created successfully:', createdEntry);

      // Replace the optimistic entry with the real one from the server
      setEntries(prev => prev.map(entry => 
        entry.isOptimistic ? createdEntry : entry
      ));
    } catch (err) {
      // Remove the optimistic entry on error
      setEntries(prev => prev.filter(entry => !entry.isOptimistic));
      setError(err.message);
    }
  };

  const handleUpdateEntry = async (entryId, updateData) => {
    try {
      // Optimistic update - update the entry immediately in the UI
      setEntries(prev => prev.map(entry => 
        entry._id === entryId 
          ? { ...entry, ...updateData, isOptimistic: true }
          : entry
      ));
      
      setEditingEntry(null);

      const response = await fetch(`http://localhost:3002/health/${entryId}`, {
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

      const updatedEntry = await response.json();
      
      // Replace the optimistic entry with the real one from the server
      setEntries(prev => prev.map(entry => 
        entry._id === entryId ? { ...updatedEntry, isOptimistic: false } : entry
      ));
    } catch (err) {
      // Revert the optimistic update on error
      setEntries(prev => prev.map(entry => 
        entry._id === entryId ? { ...entry, isOptimistic: false } : entry
      ));
      setError(err.message);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      // Store the entry to restore if deletion fails
      const entryToDelete = entries.find(entry => entry._id === entryId);
      
      // Optimistic update - remove the entry immediately from the UI
      setEntries(prev => prev.filter(entry => entry._id !== entryId));

      const response = await fetch(`http://localhost:3002/health/${entryId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Entry not found - it may have already been deleted');
        } else {
          throw new Error('Failed to delete entry');
        }
      }

      // Success - entry is already removed from UI
    } catch (err) {
      // Restore the entry on error
      if (entryToDelete) {
        setEntries(prev => [entryToDelete, ...prev]);
      }
      setError(err.message);
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

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