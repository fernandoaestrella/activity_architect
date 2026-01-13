import { AlertCircle } from 'lucide-react';

const InnovationZone = ({ onCreateActivity }) => {
  return (
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
        <button className="create-activity-btn" onClick={onCreateActivity}>
          Draft a New Activity for this State
        </button>
      </div>
    </div>
  );
};

export default InnovationZone;
