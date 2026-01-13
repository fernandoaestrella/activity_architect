import { useState, useMemo, useEffect } from 'react';
import { Settings2, Sliders, ChevronRight, User, Plus, RotateCcw } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase/config';
import { 
  AboutModal, 
  AddActivityModal, 
  TaxonomyModal, 
  InnovationZone, 
  LoadingScreen 
} from './components';
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
  // Data loading state
  const [dimensions, setDimensions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [filters, setFilters] = useState({});
  const [tolerance, setTolerance] = useState(2.0);
  const [activeDimension, setActiveDimension] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [customActivities, setCustomActivities] = useState([]);
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityDimensions, setNewActivityDimensions] = useState({});
  // Taxonomy edits: { activityName: { dimensionKey: value } }
  const [taxonomyEdits, setTaxonomyEdits] = useState({});

  // Fetch data from Firestore on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dimensions
        const dimensionsSnapshot = await getDocs(collection(db, 'dimensions'));
        const dimensionsData = dimensionsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        // Fetch activities
        const activitiesSnapshot = await getDocs(collection(db, 'activities'));
        const activitiesData = activitiesSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }));
        
        setDimensions(dimensionsData);
        setActivities(activitiesData);
        
        // Initialize filters based on loaded dimensions
        const initialFilters = dimensionsData.reduce((acc, dim) => ({ ...acc, [dim.key]: 0 }), {});
        setFilters(initialFilters);
        
        // Initialize new activity dimensions
        const initialNewDims = dimensionsData.reduce((acc, dim) => ({ ...acc, [dim.key]: 5 }), {});
        setNewActivityDimensions(initialNewDims);
        
        // Load custom activities and taxonomy edits
        setCustomActivities(loadCustomActivities());
        setTaxonomyEdits(loadTaxonomyEdits());
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoadError(error.message);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Helper to get activity value with edits applied
  const getActivityValue = (activity, dimKey) => {
    if (taxonomyEdits[activity.name] && taxonomyEdits[activity.name][dimKey] !== undefined) {
      return taxonomyEdits[activity.name][dimKey];
    }
    return activity[dimKey] ?? 5; // Default to 5 if dimension not found
  };

  // Check if there are any edits
  const hasEdits = Object.keys(taxonomyEdits).length > 0;

  // Combine default and custom activities
  const allActivities = useMemo(() => {
    return [...activities, ...customActivities];
  }, [activities, customActivities]);

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
    setFilters(dimensions.reduce((acc, dim) => ({ ...acc, [dim.key]: 0 }), {}));
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
    const initialDimensions = dimensions.reduce((acc, dim) => ({
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

  // Show loading screen while data is being fetched
  if (isLoading || loadError) {
    return <LoadingScreen error={loadError} />;
  }

  return (
    <div className="app-container">
      {/* About Modal */}
      {showAbout && (
        <AboutModal onClose={() => setShowAbout(false)} />
      )}

      {/* Add Activity Modal */}
      {showAddActivity && (
        <AddActivityModal
          onClose={() => setShowAddActivity(false)}
          dimensions={dimensions}
          newActivityName={newActivityName}
          setNewActivityName={setNewActivityName}
          newActivityDimensions={newActivityDimensions}
          onDimensionChange={handleNewActivityDimensionChange}
          onSave={handleSaveActivity}
        />
      )}

      {/* Taxonomy Modal */}
      {expandedActivity && (
        <TaxonomyModal
          activity={expandedActivity}
          dimensions={dimensions}
          filters={filters}
          taxonomyEdits={taxonomyEdits}
          getActivityValue={getActivityValue}
          onTaxonomyEdit={handleTaxonomyEdit}
          onClose={() => setExpandedActivity(null)}
        />
      )}

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
            {dimensions.map((dim) => (
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
                    {(filters[dim.key] ?? 0).toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters[dim.key] ?? 0}
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
                              <span className="metric-label">{dimensions.find(d => d.key === key)?.label || key}</span>
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
              <InnovationZone onCreateActivity={openAddActivityModal} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
