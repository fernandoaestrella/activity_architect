import { X, Github } from 'lucide-react';

const AboutModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
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
          <div className="about-fork">
            <h3>Fork This Project</h3>
            <p>If you want to fork this, go to:</p>
            <a 
              href="https://github.com/fernandoaestrella/activity_architect" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
            >
              <Github className="icon-small" />
              <span>github.com/fernandoaestrella/activity_architect</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
