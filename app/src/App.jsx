import { useState, useMemo, useEffect } from 'react';
import { Settings2, Sliders, ChevronRight, AlertCircle, User, X, Github, Plus, Save, RotateCcw } from 'lucide-react';
import { DIMENSIONS } from './data/dimensions';
import defaultActivityData from './data/activities.json';
import './App.css';

// LocalStorage keys
const STORAGE_KEY = 'activity_architect_custom_activities';
const EDITS_STORAGE_KEY = 'activity_architect_taxonomy_edits';

// Load custom activities from localStorage
const loadCustomActivities = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save custom activities to localStorage
const saveCustomActivities = (activities) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
};

// Load taxonomy edits from localStorage
const loadTaxonomyEdits = () => {
  try {
    const stored = localStorage.getItem(EDITS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save taxonomy edits to localStorage
const saveTaxonomyEdits = (edits) => {
  localStorage.setItem(EDITS_STORAGE_KEY, JSON.stringify(edits));
};

const App = () => {
  const [filters, setFilters] = useState(
    DIMENSIONS.reduce((acc, dim) => ({ ...acc, [dim.key]: 0 }), {})
  );
  const [tolerance, setTolerance] = useState(2.0);
  const [activeDimension, setActiveDimension] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [customActivities, setCustomActivities] = useState([]);
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityDimensions, setNewActivityDimensions] = useState(
    DIMENSIONS.reduce((acc, dim) => ({ ...acc, [dim.key]: 5 }), {})
  );
  // Taxonomy edits: { activityName: { dimensionKey: value } }
  const [taxonomyEdits, setTaxonomyEdits] = useState({});

  // Load custom activities and taxonomy edits on mount
  useEffect(() => {
    setCustomActivities(loadCustomActivities());
    setTaxonomyEdits(loadTaxonomyEdits());
  }, []);

  // Helper to get activity value with edits applied
  const getActivityValue = (activity, dimKey) => {
    if (taxonomyEdits[activity.name] && taxonomyEdits[activity.name][dimKey] !== undefined) {
      return taxonomyEdits[activity.name][dimKey];
    }
    return activity[dimKey];
  };

  // Check if there are any edits
  const hasEdits = Object.keys(taxonomyEdits).length > 0;

  // Combine default and custom activities
  const allActivities = useMemo(() => {
    return [...defaultActivityData, ...customActivities];
  }, [customActivities]);

  // Get only the dimensions that have active filters (value > 0)
  const activeDimensionKeys = useMemo(() => {
    return Object.entries(filters)
      .filter(([_, v]) => v > 0)
      .map(([key, _]) => key);
  }, [filters]);

  const filteredActivities = useMemo(() => {
    // Return all if no filters are significantly engaged (above 0)
    const activeFilters = Object.entries(filters).filter(([_, v]) => v > 0);
    if (activeFilters.length === 0) return allActivities;

    return allActivities.filter(activity => {
      return activeFilters.every(([key, value]) => {
        const activityValue = getActivityValue(activity, key);
        const diff = Math.abs(activityValue - value);
        return diff <= tolerance;
      });
    });
  }, [filters, tolerance, allActivities, taxonomyEdits]);

  const handleSliderChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: parseFloat(val) }));
  };

  const resetFilters = () => {
    setFilters(DIMENSIONS.reduce((acc, dim) => ({ ...acc, [dim.key]: 0 }), {}));
  };

  // Handle taxonomy edit
  const handleTaxonomyEdit = (activityName, dimKey, value) => {
    const newEdits = {
      ...taxonomyEdits,
      [activityName]: {
        ...(taxonomyEdits[activityName] || {}),
        [dimKey]: parseFloat(value)
      }
    };
    setTaxonomyEdits(newEdits);
    saveTaxonomyEdits(newEdits);
    
    // Update expanded activity if it's the one being edited
    if (expandedActivity && expandedActivity.name === activityName) {
      setExpandedActivity({
        ...expandedActivity,
        [dimKey]: parseFloat(value)
      });
    }
  };

  // Clear all taxonomy edits
  const clearTaxonomyEdits = () => {
    setTaxonomyEdits({});
    saveTaxonomyEdits({});
  };

  // Open Add Activity modal with current filters as defaults
  const openAddActivityModal = () => {
    // Pre-populate dimensions with current filter values (or 5 if not filtered)
    const initialDimensions = DIMENSIONS.reduce((acc, dim) => ({
      ...acc,
      [dim.key]: filters[dim.key] > 0 ? filters[dim.key] : 5
    }), {});
    setNewActivityDimensions(initialDimensions);
    setNewActivityName('');
    setShowAddActivity(true);
  };

  // Handle dimension change in Add Activity form
  const handleNewActivityDimensionChange = (key, val) => {
    setNewActivityDimensions(prev => ({ ...prev, [key]: parseFloat(val) }));
  };

  // Save new activity
  const handleSaveActivity = () => {
    if (!newActivityName.trim()) return;

    const newActivity = {
      name: newActivityName.trim(),
      ...newActivityDimensions,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    const updatedCustomActivities = [...customActivities, newActivity];
    setCustomActivities(updatedCustomActivities);
    saveCustomActivities(updatedCustomActivities);
    setShowAddActivity(false);
    setNewActivityName('');
  };

  return (
    <div className="app-container">
      {/* About Modal */}
      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAbout(false)}>
              <X className="icon-small" />
            </button>
            <div className="about-content">
              <h2 className="about-title">About Activity Architect</h2>
              <p className="about-description">
                A taxonomy calibration engine for discovering and architecting activities
                based on multi-dimensional requirements.
              </p>
              <div className="about-author">
                <h3>Created by</h3>
                <a 
                  href="https://github.com/fernandoaestrella" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  <Github className="icon-small" />
                  <span>Fernando A. Estrella</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div className="modal-overlay" onClick={() => setShowAddActivity(false)}>
          <div className="add-activity-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddActivity(false)}>
              <X className="icon-small" />
            </button>
            <div className="add-activity-header">
              <h2 className="add-activity-title">Create New Activity</h2>
              <p className="add-activity-subtitle">Define the dimensional profile for your activity</p>
            </div>

            <div className="add-activity-form">
              <div className="form-field">
                <label className="form-label">Activity Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter activity name..."
                  value={newActivityName}
                  onChange={(e) => setNewActivityName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-dimensions">
                <h3 className="form-dimensions-title">Dimensional Values</h3>
                <div className="form-dimensions-list">
                  {DIMENSIONS.map(dim => (
                    <div key={dim.key} className="form-dimension-item">
                      <div className="form-dimension-header">
                        <label className="form-dimension-label">{dim.label}</label>
                        <span className="form-dimension-value">
                          {newActivityDimensions[dim.key].toFixed(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={newActivityDimensions[dim.key]}
                        onChange={(e) => handleNewActivityDimensionChange(dim.key, e.target.value)}
                        className="form-dimension-slider"
                      />
                      <p className="form-dimension-desc">{dim.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                className="save-activity-btn"
                onClick={handleSaveActivity}
                disabled={!newActivityName.trim()}
              >
                <Save className="icon-tiny" />
                Save Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Taxonomy Modal */}
      {expandedActivity && (() => {
        // Separate dimensions into filtered and non-filtered
        const filteredDims = DIMENSIONS.filter(dim => filters[dim.key] > 0);
        const otherDims = DIMENSIONS.filter(dim => filters[dim.key] === 0);
        
        // Sort filtered dimensions by closest match (smallest difference)
        const sortedFilteredDims = [...filteredDims].sort((a, b) => {
          const diffA = Math.abs(getActivityValue(expandedActivity, a.key) - filters[a.key]);
          const diffB = Math.abs(getActivityValue(expandedActivity, b.key) - filters[b.key]);
          return diffA - diffB;
        });

        return (
          <div className="modal-overlay" onClick={() => setExpandedActivity(null)}>
            <div className="taxonomy-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setExpandedActivity(null)}>
                <X className="icon-small" />
              </button>
              <div className="taxonomy-header">
                <h2 className="taxonomy-title">{expandedActivity.name}</h2>
                <p className="taxonomy-subtitle">Dimensional Analysis (drag sliders to edit)</p>
              </div>
              
              <div className="taxonomy-sections">
                {/* Filtered Dimensions Section */}
                {sortedFilteredDims.length > 0 && (
                  <div className="taxonomy-section">
                    <h3 className="taxonomy-section-title">Filtered Dimensions</h3>
                    <p className="taxonomy-section-subtitle">Sorted by closest match to your filters</p>
                    <div className="taxonomy-list">
                      {sortedFilteredDims.map(dim => {
                        const activityValue = getActivityValue(expandedActivity, dim.key);
                        const diff = Math.abs(activityValue - filters[dim.key]);
                        const isEdited = taxonomyEdits[expandedActivity.name]?.[dim.key] !== undefined;
                        return (
                          <div key={dim.key} className={`taxonomy-item filtered ${isEdited ? 'edited' : ''}`}>
                            <div className="taxonomy-item-header">
                              <span className="taxonomy-item-label">
                                {dim.label}
                                {isEdited && <span className="edited-badge">edited</span>}
                              </span>
                              <div className="taxonomy-item-values">
                                <span className="taxonomy-item-filter">Filter: {filters[dim.key].toFixed(1)}</span>
                                <span className="taxonomy-item-value">{activityValue.toFixed(1)}</span>
                                <span className={`taxonomy-item-diff ${diff <= 1 ? 'close' : diff <= 2 ? 'medium' : 'far'}`}>
                                  Δ {diff.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              step="0.1"
                              value={activityValue}
                              onChange={(e) => handleTaxonomyEdit(expandedActivity.name, dim.key, e.target.value)}
                              className="taxonomy-edit-slider"
                            />
                            <div className="taxonomy-bar-bg">
                              <div 
                                className="taxonomy-bar-fill" 
                                style={{ width: `${activityValue * 10}%` }}
                              />
                              <div 
                                className="taxonomy-bar-target" 
                                style={{ left: `${filters[dim.key] * 10}%` }}
                              />
                            </div>
                            <p className="taxonomy-item-desc">{dim.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Other Dimensions Section */}
                {otherDims.length > 0 && (
                  <div className="taxonomy-section">
                    <h3 className="taxonomy-section-title">Other Dimensions</h3>
                    <p className="taxonomy-section-subtitle">Not currently filtered</p>
                    <div className="taxonomy-list">
                      {otherDims.map(dim => {
                        const activityValue = getActivityValue(expandedActivity, dim.key);
                        const isEdited = taxonomyEdits[expandedActivity.name]?.[dim.key] !== undefined;
                        return (
                          <div key={dim.key} className={`taxonomy-item ${isEdited ? 'edited' : ''}`}>
                            <div className="taxonomy-item-header">
                              <span className="taxonomy-item-label">
                                {dim.label}
                                {isEdited && <span className="edited-badge">edited</span>}
                              </span>
                              <span className="taxonomy-item-value">{activityValue.toFixed(1)}</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              step="0.1"
                              value={activityValue}
                              onChange={(e) => handleTaxonomyEdit(expandedActivity.name, dim.key, e.target.value)}
                              className="taxonomy-edit-slider"
                            />
                            <div className="taxonomy-bar-bg">
                              <div 
                                className="taxonomy-bar-fill" 
                                style={{ width: `${activityValue * 10}%` }}
                              />
                            </div>
                            <p className="taxonomy-item-desc">{dim.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <Sliders className="icon" />
          </div>
          <div>
            <h1 className="brand-title">Activity Architect</h1>
            <p className="brand-subtitle">Taxonomy Calibration Engine</p>
          </div>
        </div>
        <div className="header-controls">
          <div className="tolerance-control">
            <span className="tolerance-label">Precision Threshold</span>
            <input 
              type="range" 
              min="0.5" 
              max="5" 
              step="0.1" 
              value={tolerance}
              onChange={(e) => setTolerance(parseFloat(e.target.value))}
              className="tolerance-slider"
            />
          </div>
          <button onClick={() => setShowAbout(true)} className="about-btn">
            <User className="icon-tiny" />
            About
          </button>
        </div>
      </header>

      <div className="app-content">
        {/* Sidebar: The Mixing Console */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <Settings2 className="icon-small" />
            <h2 className="sidebar-title">Dimension Mixer</h2>
          </div>

          <div className="dimension-list">
            {DIMENSIONS.map((dim) => (
              <div 
                key={dim.key} 
                className={`dimension-item ${filters[dim.key] > 0 ? 'active' : ''}`}
                onMouseEnter={() => setActiveDimension(dim)}
                onMouseLeave={() => setActiveDimension(null)}
              >
                <div className="dimension-header">
                  <label className="dimension-label">
                    {dim.label}
                  </label>
                  <span className="dimension-value">
                    {filters[dim.key].toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters[dim.key]}
                  onChange={(e) => handleSliderChange(dim.key, e.target.value)}
                  className="dimension-slider"
                />
              </div>
            ))}
          </div>

          <div className="sidebar-actions">
            <button 
              disabled 
              className="add-dimension-btn"
              title="Coming soon"
            >
              <Plus className="icon-tiny" />
              Add Dimension
            </button>
            <button onClick={resetFilters} className="clear-btn sidebar-clear-btn">
              Clear Console
            </button>
          </div>
        </aside>

        {/* Main View: The Matching Engine */}
        <main className="main-content">
          
          {/* Active Tooltip / Meta-Instruction */}
          <div className="tooltip-area">
            <div className="tooltip-content">
              {activeDimension ? (
                <>
                  <h3 className="tooltip-title active">{activeDimension.label}</h3>
                  <p className="tooltip-description active">
                    {activeDimension.description}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="tooltip-title">Architecture Mode</h3>
                  <p className="tooltip-description">
                    Adjust the sliders to define your precise minute requirements for reality...
                  </p>
                </>
              )}
            </div>
            {hasEdits && (
              <button onClick={clearTaxonomyEdits} className="clear-edits-btn">
                <RotateCcw className="icon-tiny" />
                Clear Taxonomy Edits
              </button>
            )}
          </div>

          {/* Results Grid */}
          <div className="results-grid">
            {filteredActivities.length > 0 ? (
              <>
                {filteredActivities.map((activity) => (
                  <div key={activity.name} className={`activity-card ${activity.isCustom ? 'custom' : ''}`}>
                    <div className="card-header">
                      <h3 className="card-title">{activity.name}</h3>
                      {activity.isCustom && <span className="custom-badge">Custom</span>}
                    </div>
                    
                    
                    {activeDimensionKeys.length > 0 && (
                      <div className="card-metrics">
                        {/* Show only actively filtered dimensions */}
                        <div className="metrics-grid">
                          {activeDimensionKeys.map(key => (
                            <div key={key} className="metric-item">
                              <span className="metric-label">{DIMENSIONS.find(d => d.key === key)?.label || key}</span>
                              <div className="metric-bar-container">
                                <div className="metric-bar-bg">
                                  <div 
                                    className="metric-bar-fill" 
                                    style={{ width: `${getActivityValue(activity, key) * 10}%` }}
                                  />
                                </div>
                                <span className="metric-value">{getActivityValue(activity, key).toFixed(1)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button 
                      className="view-taxonomy-btn"
                      onClick={() => setExpandedActivity(activity)}
                    >
                      View Complete Taxonomy <ChevronRight className="icon-tiny" />
                    </button>
                  </div>
                ))}
                
                {/* Add Activity Button at the bottom of filtered results */}
                <div className="add-activity-card" onClick={openAddActivityModal}>
                  <Plus className="add-activity-icon" />
                  <span className="add-activity-text">Add New Activity</span>
                </div>
              </>
            ) : (
              /* The INNOVATION ZONE alert */
              <div className="innovation-zone">
                <div className="innovation-icon-container">
                  <AlertCircle className="innovation-icon" />
                </div>
                <h2 className="innovation-title">Entrance: The Innovation Zone</h2>
                <p className="innovation-description">
                  You have constructed a minute requirement for which <span className="highlight">no existing activity</span> is currently calibrated.
                </p>
                <div className="innovation-box">
                  <p className="innovation-quote">"Notice you can find your fun anywhere, and it is a deeper, more reliable source of stability. You can create your own game inside a game."</p>
                  <button className="create-activity-btn" onClick={openAddActivityModal}>
                    Draft a New Activity for this State
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
