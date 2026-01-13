import { X } from 'lucide-react';

const TaxonomyModal = ({ 
  activity, 
  dimensions, 
  filters, 
  taxonomyEdits,
  getActivityValue,
  onTaxonomyEdit,
  onClose 
}) => {
  // Separate dimensions into filtered and non-filtered
  const filteredDims = dimensions.filter(dim => filters[dim.key] > 0);
  const otherDims = dimensions.filter(dim => filters[dim.key] === 0);
  
  // Sort filtered dimensions by closest match (smallest difference)
  const sortedFilteredDims = [...filteredDims].sort((a, b) => {
    const diffA = Math.abs(getActivityValue(activity, a.key) - filters[a.key]);
    const diffB = Math.abs(getActivityValue(activity, b.key) - filters[b.key]);
    return diffA - diffB;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="taxonomy-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X className="icon-small" />
        </button>
        <div className="taxonomy-header">
          <h2 className="taxonomy-title">{activity.name}</h2>
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
                  const activityValue = getActivityValue(activity, dim.key);
                  const diff = Math.abs(activityValue - filters[dim.key]);
                  const isEdited = taxonomyEdits[activity.name]?.[dim.key] !== undefined;
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
                        onChange={(e) => onTaxonomyEdit(activity.name, dim.key, e.target.value)}
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
                  const activityValue = getActivityValue(activity, dim.key);
                  const isEdited = taxonomyEdits[activity.name]?.[dim.key] !== undefined;
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
                        onChange={(e) => onTaxonomyEdit(activity.name, dim.key, e.target.value)}
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
};

export default TaxonomyModal;
