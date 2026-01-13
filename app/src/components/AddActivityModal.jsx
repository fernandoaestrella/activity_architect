import { X, Save } from 'lucide-react';

const AddActivityModal = ({ 
  onClose, 
  dimensions, 
  newActivityName, 
  setNewActivityName,
  newActivityDimensions,
  onDimensionChange,
  onSave 
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-activity-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
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
              {dimensions.map(dim => (
                <div key={dim.key} className="form-dimension-item">
                  <div className="form-dimension-header">
                    <label className="form-dimension-label">{dim.label}</label>
                    <span className="form-dimension-value">
                      {(newActivityDimensions[dim.key] ?? 5).toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={newActivityDimensions[dim.key] ?? 5}
                    onChange={(e) => onDimensionChange(dim.key, e.target.value)}
                    className="form-dimension-slider"
                  />
                  <p className="form-dimension-desc">{dim.description}</p>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="save-activity-btn"
            onClick={onSave}
            disabled={!newActivityName.trim()}
          >
            <Save className="icon-tiny" />
            Save Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddActivityModal;
