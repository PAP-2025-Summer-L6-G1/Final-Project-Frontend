import { useState, useEffect } from 'react';
import './HealthEntryForm.css';

function HealthEntryForm({ onSubmit, onCancel, entry }) {
  const [formData, setFormData] = useState({
    type: 'weight',
    value: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    // Blood pressure specific
    systolic: '',
    diastolic: '',
    // Meal specific
    mealType: '',
    calories: '',
    nutrition: {
      protein: '',
      carbs: '',
      fat: '',
      fiber: ''
    },
    // Workout specific
    workoutType: '',
    duration: '',
    exercises: []
  });

  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: ''
  });

  const [showExerciseForm, setShowExerciseForm] = useState(false);

  useEffect(() => {
    if (entry) {
      setFormData({
        type: entry.type,
        value: entry.value || '',
        unit: entry.unit || '',
        date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: entry.notes || '',
        systolic: entry.systolic || '',
        diastolic: entry.diastolic || '',
        mealType: entry.mealType || '',
        calories: entry.calories || '',
        nutrition: {
          protein: entry.nutrition?.protein || '',
          carbs: entry.nutrition?.carbs || '',
          fat: entry.nutrition?.fat || '',
          fiber: entry.nutrition?.fiber || ''
        },
        workoutType: entry.workoutType || '',
        duration: entry.duration || '',
        exercises: entry.exercises || []
      });
    }
  }, [entry]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('nutrition.')) {
      const nutritionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        nutrition: {
          ...prev.nutrition,
          [nutritionField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      type: formData.type,
      value: formData.value,
      unit: formData.unit,
      date: formData.date,
      notes: formData.notes
    };

    // Add type-specific data
    if (formData.type === 'blood_pressure') {
      submitData.systolic = parseInt(formData.systolic);
      submitData.diastolic = parseInt(formData.diastolic);
      submitData.value = `${formData.systolic}/${formData.diastolic}`;
      submitData.unit = 'mmHg';
    } else if (formData.type === 'meal') {
      submitData.mealType = formData.mealType;
      submitData.calories = parseInt(formData.calories) || 0;
      submitData.nutrition = {
        protein: parseFloat(formData.nutrition.protein) || 0,
        carbs: parseFloat(formData.nutrition.carbs) || 0,
        fat: parseFloat(formData.nutrition.fat) || 0,
        fiber: parseFloat(formData.nutrition.fiber) || 0
      };
    } else if (formData.type === 'workout') {
      submitData.workoutType = formData.workoutType;
      submitData.duration = parseInt(formData.duration) || 0;
      submitData.exercises = formData.exercises;
    }

    if (entry) {
      onSubmit(entry._id, submitData);
    } else {
      onSubmit(submitData);
    }
  };

  const addExercise = () => {
    if (currentExercise.name) {
      setFormData(prev => ({
        ...prev,
        exercises: [...prev.exercises, { ...currentExercise }]
      }));
      setCurrentExercise({
        name: '',
        sets: '',
        reps: '',
        weight: '',
        duration: ''
      });
      setShowExerciseForm(false);
    }
  };

  const removeExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const getUnitsForType = (type) => {
    switch (type) {
      case 'weight':
        return ['kg', 'lbs'];
      case 'blood_pressure':
        return ['mmHg'];
      case 'meal':
        return ['calories', 'grams'];
      case 'workout':
        return ['minutes', 'hours'];
      default:
        return [];
    }
  };

  return (
    <div className="health-entry-form-overlay">
      <div className="health-entry-form">
        <div className="form-header">
          <h2>{entry ? 'Edit Health Entry' : 'Add New Health Entry'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="type">Entry Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="weight">Weight</option>
              <option value="blood_pressure">Blood Pressure</option>
              <option value="meal">Meal</option>
              <option value="workout">Workout</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          {formData.type === 'weight' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="value">Weight</label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  step="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select unit</option>
                  {getUnitsForType('weight').map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {formData.type === 'blood_pressure' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="systolic">Systolic</label>
                <input
                  type="number"
                  id="systolic"
                  name="systolic"
                  value={formData.systolic}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="diastolic">Diastolic</label>
                <input
                  type="number"
                  id="diastolic"
                  name="diastolic"
                  value={formData.diastolic}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          {formData.type === 'meal' && (
            <>
              <div className="form-group">
                <label htmlFor="mealType">Meal Type</label>
                <select
                  id="mealType"
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleInputChange}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="calories">Calories</label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  placeholder="Total calories"
                />
              </div>

              <div className="nutrition-section">
                <h4>Nutrition (per 100g)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nutrition.protein">Protein (g)</label>
                    <input
                      type="number"
                      name="nutrition.protein"
                      value={formData.nutrition.protein}
                      onChange={handleInputChange}
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nutrition.carbs">Carbs (g)</label>
                    <input
                      type="number"
                      name="nutrition.carbs"
                      value={formData.nutrition.carbs}
                      onChange={handleInputChange}
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nutrition.fat">Fat (g)</label>
                    <input
                      type="number"
                      name="nutrition.fat"
                      value={formData.nutrition.fat}
                      onChange={handleInputChange}
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nutrition.fiber">Fiber (g)</label>
                    <input
                      type="number"
                      name="nutrition.fiber"
                      value={formData.nutrition.fiber}
                      onChange={handleInputChange}
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {formData.type === 'workout' && (
            <>
              <div className="form-group">
                <label htmlFor="workoutType">Workout Type</label>
                <select
                  id="workoutType"
                  name="workoutType"
                  value={formData.workoutType}
                  onChange={handleInputChange}
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="sports">Sports</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Total workout duration"
                />
              </div>

              <div className="exercises-section">
                <h4>Exercises</h4>
                {formData.exercises.map((exercise, index) => (
                  <div key={index} className="exercise-item">
                    <span>{exercise.name}</span>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeExercise(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {showExerciseForm ? (
                  <div className="exercise-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Exercise Name</label>
                        <input
                          type="text"
                          value={currentExercise.name}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Bench Press"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Sets</label>
                        <input
                          type="number"
                          value={currentExercise.sets}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, sets: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Reps</label>
                        <input
                          type="number"
                          value={currentExercise.reps}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, reps: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Weight (lbs)</label>
                        <input
                          type="number"
                          value={currentExercise.weight}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, weight: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Duration (min)</label>
                        <input
                          type="number"
                          value={currentExercise.duration}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, duration: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="exercise-form-buttons">
                      <button type="button" className="btn btn-success" onClick={addExercise}>
                        Add Exercise
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowExerciseForm(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setShowExerciseForm(true)}
                  >
                    Add Exercise
                  </button>
                )}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Additional notes..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {entry ? 'Update Entry' : 'Add Entry'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HealthEntryForm; 