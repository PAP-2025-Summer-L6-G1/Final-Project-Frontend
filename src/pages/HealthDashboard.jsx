import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HealthEntryForm from '../components/HealthEntryForm';
import HealthEntryList from '../components/HealthEntryList';
import HealthStats from '../components/HealthStats';
import AccountContext from '../contexts/AccountContext';
import { signupUser, loginUser, logoutUser } from '../api/signIn';
import './HealthDashboard.css';

function HealthDashboard() {
  // Handle authentication locally for this component
  const [loggedInUser, setLoggedInUser] = useState("");
  
  // Load authentication state when component mounts
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setLoggedInUser(username);
    }
  }, []);
  
  console.log('HealthDashboard - loggedInUser:', loggedInUser);
  console.log('HealthDashboard - loggedInUser type:', typeof loggedInUser);
  
  // Use the same userId that the backend is hardcoded to use
  const userId = '507f1f77bcf86cd799439011';
  
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchEntries = async () => {
    if (!loggedInUser) {
      console.log('User not logged in');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3002/health/?type=${selectedType !== 'all' ? selectedType : ''}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      
      const data = await response.json();
      console.log('Fetched entries:', data);
      console.log('First entry structure:', data[0]);
      console.log('First entry _id:', data[0]?._id);
      console.log('First entry keys:', data[0] ? Object.keys(data[0]) : 'No entries');
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
    } else {
      // Clear entries when user logs out
      setEntries([]);
      setLoading(false);
      setError(null);
    }
  }, [selectedType, loggedInUser]);

  // If user is not logged in, show a message instead of the dashboard
  if (!loggedInUser) {
    return (
      <div className="health-dashboard">
        <div className="dashboard-header">
          <h1>Personal Health Dashboard</h1>
        </div>
        <div className="dashboard-content">
          <div className="login-required">
            <p>Please log in to view your health dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

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
      console.log('Updating entry with ID:', entryId);
      console.log('Update data:', updateData);
      
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
      
      // Set success state to show "OK" button
      setUpdateSuccess(true);
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
    console.log('handleEditEntry called with:', entry);
    console.log('Entry _id:', entry._id);
    console.log('Entry type:', typeof entry._id);
    setEditingEntry(entry);
    setShowForm(true);
    setUpdateSuccess(false); // Reset success state when starting to edit
  };

  const handleFormSubmit = (entryId, updateData) => {
    console.log('handleFormSubmit called with:');
    console.log('entryId:', entryId);
    console.log('updateData:', updateData);
    console.log('entryId type:', typeof entryId);
    
    if (entryId && updateData) {
      // Update existing entry - both parameters should exist
      handleUpdateEntry(entryId, updateData);
    } else {
      // Create new entry - entryId is actually the form data when creating
      handleCreateEntry(entryId);
    }
  };

  return (
    <AccountContext.Provider value={{ loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser }}>
      <Navbar />
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
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingEntry(null);
                setUpdateSuccess(false);
              }}
              entry={editingEntry}
              updateSuccess={updateSuccess}
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
    </AccountContext.Provider>
  );
}

export default HealthDashboard; 