import { useState, useMemo } from 'react';
import { Settings2, Sliders, ChevronRight, AlertCircle, User, X, Github, Plus } from 'lucide-react';
import { DIMENSIONS } from './data/dimensions';
import activityData from './data/activities.json';
import './App.css';

const App = () => {
  const [filters, setFilters] = useState(
    DIMENSIONS.reduce((acc, dim) => ({ ...acc, [dim.key]: 0 }), {})
  );
  const [tolerance, setTolerance] = useState(2.0);
  const [activeDimension, setActiveDimension] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState(null);

  // Get only the dimensions that have active filters (value > 0)
  const activeDimensionKeys = useMemo(() => {
    return Object.entries(filters)
      .filter(([_, v]) => v > 0)
      .map(([key, _]) => key);
  }, [filters]);

  const filteredActivities = useMemo(() => {
    // Return all if no filters are significantly engaged (above 0)
    const activeFilters = Object.entries(filters).filter(([_, v]) => v > 0);
    if (activeFilters.length === 0) return activityData;

    return activityData.filter(activity => {
      return activeFilters.every(([key, value]) => {
        const diff = Math.abs(activity[key] - value);
        return diff <= tolerance;
      });
    });
  }, [filters, tolerance]);

  const handleSliderChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: parseFloat(val) }));
  };

  const resetFilters = () => {
    setFilters(DIMENSIONS.reduce((acc, dim) => ({ ...acc, [dim.key]: 0 }), {}));
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

      {/* Taxonomy Modal */}
      {expandedActivity && (() => {
        // Separate dimensions into filtered and non-filtered
        const filteredDims = DIMENSIONS.filter(dim => filters[dim.key] > 0);
        const otherDims = DIMENSIONS.filter(dim => filters[dim.key] === 0);
        
        // Sort filtered dimensions by closest match (smallest difference)
        const sortedFilteredDims = [...filteredDims].sort((a, b) => {
          const diffA = Math.abs(expandedActivity[a.key] - filters[a.key]);
          const diffB = Math.abs(expandedActivity[b.key] - filters[b.key]);
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
                <p className="taxonomy-subtitle">Dimensional Analysis</p>
              </div>
              
              <div className="taxonomy-sections">
                {/* Filtered Dimensions Section */}
                {sortedFilteredDims.length > 0 && (
                  <div className="taxonomy-section">
                    <h3 className="taxonomy-section-title">Filtered Dimensions</h3>
                    <p className="taxonomy-section-subtitle">Sorted by closest match to your filters</p>
                    <div className="taxonomy-list">
                      {sortedFilteredDims.map(dim => {
                        const diff = Math.abs(expandedActivity[dim.key] - filters[dim.key]);
                        return (
                          <div key={dim.key} className="taxonomy-item filtered">
                            <div className="taxonomy-item-header">
                              <span className="taxonomy-item-label">{dim.label}</span>
                              <div className="taxonomy-item-values">
                                <span className="taxonomy-item-filter">Filter: {filters[dim.key].toFixed(1)}</span>
                                <span className="taxonomy-item-value">{expandedActivity[dim.key].toFixed(1)}</span>
                                <span className={`taxonomy-item-diff ${diff <= 1 ? 'close' : diff <= 2 ? 'medium' : 'far'}`}>
                                  Δ {diff.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <div className="taxonomy-bar-bg">
                              <div 
                                className="taxonomy-bar-fill" 
                                style={{ width: `${expandedActivity[dim.key] * 10}%` }}
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
                      {otherDims.map(dim => (
                        <div key={dim.key} className="taxonomy-item">
                          <div className="taxonomy-item-header">
                            <span className="taxonomy-item-label">{dim.label}</span>
                            <span className="taxonomy-item-value">{expandedActivity[dim.key].toFixed(1)}</span>
                          </div>
                          <div className="taxonomy-bar-bg">
                            <div 
                              className="taxonomy-bar-fill" 
                              style={{ width: `${expandedActivity[dim.key] * 10}%` }}
                            />
                          </div>
                          <p className="taxonomy-item-desc">{dim.description}</p>
                        </div>
                      ))}
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

          {/* Results Grid */}
          <div className="results-grid">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div key={activity.name} className="activity-card">
                  <div className="card-header">
                    <h3 className="card-title">{activity.name}</h3>
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
                                  style={{ width: `${activity[key] * 10}%` }}
                                />
                              </div>
                              <span className="metric-value">{activity[key].toFixed(1)}</span>
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
              ))
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
                  <button className="create-activity-btn">
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
