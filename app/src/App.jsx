import { useState, useMemo } from 'react';
import { Settings2, Sparkles, Sliders, ChevronRight, AlertCircle } from 'lucide-react';
import { DIMENSIONS } from './data/dimensions';
import activityData from './data/activities.json';
import './App.css';

const App = () => {
  const [filters, setFilters] = useState(
    DIMENSIONS.reduce((acc, dim) => ({ ...acc, [dim.key]: 0 }), {})
  );
  const [tolerance, setTolerance] = useState(2.0);
  const [activeDimension, setActiveDimension] = useState(null);

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
          <button onClick={resetFilters} className="clear-btn">
            Clear Console
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
                className="dimension-item"
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
                    <div className="match-badge">
                      <Sparkles className="icon-tiny" />
                      <span>MATCHED</span>
                    </div>
                  </div>
                  
                  <div className="card-metrics">
                    {/* Tiny visualizers for key dimensions */}
                    <div className="metrics-grid">
                      {['actualization', 'chakra', 'interactivity', 'speed'].map(key => (
                        <div key={key} className="metric-item">
                          <span className="metric-label">{key}</span>
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
                  
                  <button className="view-taxonomy-btn">
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
